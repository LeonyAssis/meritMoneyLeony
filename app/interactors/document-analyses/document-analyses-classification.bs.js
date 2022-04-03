'use strict';

const Interactor = require('../interactor.bs');

class DocumentAnalysesClassificationBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.documentAnalysesClassificationRepository = params.documentAnalysesClassificationRepository;
  }

  async create(req) {
    this.validator.execute('document-analyses-classification.json', req.body);
    let document_id = req.body.document_id;
    let new_level = req.body.level;
    let email = req.body.email;
    let status = 'finished';
    let document = null;

    let document_analyses = await this.documentAnalysesClassificationRepository
      .getDocument(document_id);
    if (!document_analyses)
      throw this.errorService
        .get('document_analyses_classification_document_id_not_found');

    if (!document_analyses.corporation_id) {
      let document_number = await this.documentAnalysesClassificationRepository
        .getCpfByDocumentId(document_id);
      document = document_number['profile.cpf'];
    } else {
      let corporation_number = await this.documentAnalysesClassificationRepository
        .getCnpjByDocumentId(document_id);
      document = corporation_number['corporation.cnpj'];
    }

    let compliance_analyses = await this.documentAnalysesClassificationRepository
      .getComplianceAnalyses(document_id);

    let account_analyst = await this.documentAnalysesClassificationRepository
      .getAccountAnalysts(email);
    if (!account_analyst)
      throw this.errorService
        .get('user_is_not_authorized_to_classificate_document');

    let analyst_id = account_analyst.id;

    if (!compliance_analyses) {
      await this.documentAnalysesClassificationRepository
        .create(document_id, analyst_id, new_level, status, document);
    } else {
      if (compliance_analyses.level == null) {
        await this.documentAnalysesClassificationRepository
          .updateLevel(compliance_analyses.id, new_level, analyst_id);
      } else {
        await this.documentAnalysesClassificationRepository
          .create(document_id, analyst_id, new_level, status, document);
      }
    }
  }

  async get(req) {

    let document = req.params.document;

    let compliance_analysis = await this.documentAnalysesClassificationRepository
      .getComplianceByDocument(document);

    if (!compliance_analysis)
      throw this.errorService
        .get('compliance_analyses_documents_not_found');

    return {
      level: compliance_analysis.level
    };


  }
}

module.exports = DocumentAnalysesClassificationBs;
