'use strict';

const Interactor = require('../interactor.bs');

class DocumentSituationBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.awsSqsService = params.awsSqsService;
    this.dateService = params.dateService;
    this.config = params.config;
    this.documentSituationRepository = params.documentSituationRepository;
    this.documentSituationService = params.documentSituationService;
    this.dateService = params.dateService;
  }

  async get(req) {
    let limit = parseInt(req.query.limit) || 1;
    let documentSituation = await this.awsSqsService
      .getMessage(this.config.sqs.prod_gis_spb, limit);

    if (!documentSituation) {
      throw this.errorService
        .get('no_message_returned_from_sqs');
    }

    documentSituation.forEach(async res => {
      let getDocumentSituation = await this.documentSituationRepository.
        get_by_message_id(res.MessageId);

      if (getDocumentSituation.length > 0) {
        await this.awsSqsService
          .deleteMessage(this.config.sqs.prod_gis_spb, res);
      }

      let dataBody = JSON.parse(res.Body);
      await this.documentSituationRepository
        .create(res.MessageId, dataBody.type, dataBody.body.document, dataBody.body.situation, dataBody.body.updatedSituation, this.dateService.toDateTimeFormat(parseInt(res.Attributes.SentTimestamp)))
        .then((resSituation) => {
          dataBody.body.particpants.forEach(resParticipants => {
            this.documentSituationRepository
              .create_participants(resSituation.id, resParticipants.name, resParticipants.ispb, resParticipants.code);
          });
          this.awsSqsService.deleteMessage(this.config.sqs.prod_gis_spb, res);
        });
    });
  }

  async block(req) {

    let type = req.params.type;
    let status;
    let action;

    if (type == 'emissions') {
      status = 'waiting';
      action = 'charges';
    } else if (type == 'shutdown') {
      status = 'emissions_block';
      action = 'shutdown';
    } else
      throw this.errorService
        .get('document_situation_type_not_valid');

    let document_situation = await this.documentSituationRepository
      .getDocument(status);

    if (!document_situation)
      throw this.errorService
        .get('document_situation_not_found');

    if (action == 'shutdown') {
      let sixty_days_ago = await this.dateService.subtract(new Date(), 60, 'day');
      if (document_situation.blocked_emission_at) {
        if (document_situation.blocked_emission_at > sixty_days_ago)
          throw this.errorService
            .get('document_situation_not_found');
      }
    }

    let resp = await this.documentSituationService.intranetBlockDocument(document_situation.document, action);

    if (resp.output == 200) {
      let gerencianet_customer = null;
      if (document_situation.document.length == 11)
        gerencianet_customer = await this.documentSituationRepository
          .getProfileFromDocument(document_situation.document);
      else
        gerencianet_customer = await this.documentSituationRepository
          .getCorporationFromDocument(document_situation.document);

      if (!gerencianet_customer) {
        await this.documentSituationRepository
          .updateDocumentSituation(document_situation, 'new_account_block', resp, new Date());
      } else {
        if (status == 'waiting')
          await this.documentSituationRepository
            .updateDocumentSituation(document_situation, 'emissions_block', resp, new Date());
        else //if (status == 'emissions_block') se necessário voltar a linha(adequação de testes)
          await this.documentSituationRepository
            .updateDocumentSituation(document_situation, 'document_block', resp, new Date());
      }
    } else {
      await this.documentSituationRepository
        .updateDocumentSituation(document_situation, 'error', resp, new Date());
    }
  }
}

module.exports = DocumentSituationBs;
