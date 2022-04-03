'use strict';

const Interactor = require('../interactor.bs');

class CorreiosBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.formatService = params.formatService;
    this.correiosRequestService = params.correiosRequestService;
    this.constants = params.constants;
    this.validator = params.validatorService;
    this.config = params.config;
    this.correiosRepository = params.correiosRepository;
    this.correiosService = params.correiosService;
    this.correiosGuidesService = params.correiosGuidesService;
    this.util = params.util;
  }

  async addressInfoByZipcode(req) {
    return this.correiosRequestService.searchCEP({
      cep: req.params.zipcode
    }, req.gis_log_id);
  }

  // ROBO
  async clientSearch() {
    let postCards = Object.keys(this.config.correios.cartao_postagem);
    let response = [];

    for (let postCard of postCards) {

      let postCardData = this.config.correios.cartao_postagem[postCard];

      let addtionalInfo = await this.correiosService.getClient(postCard, 0);

      let correiosClientData = {
        post_card: postCard,
        contract: postCardData.contrato,
        administrative_code: addtionalInfo.contratos[0].cartoesPostagem[0].codigoAdministrativo,
        cnpj: addtionalInfo.cnpj
      };
      let correiosClient = await this.correiosRepository.getClientByPostCard(postCard);

      if (!correiosClient) {
        await this.correiosRepository.insertCorreiosClient(correiosClientData);
      } else if (await this.correiosService.hasChangesCorreiosClient(correiosClientData, correiosClient)) {
        console.log('update essa parada');
      }

      for (let contract of addtionalInfo.contratos) {
        for (let card of contract.cartoesPostagem) {
          let correiosClient = await this.correiosRepository.getClientByPostCard(card.numero);

          for (let service of card.servicos) {
            let correios_service = await this.correiosRepository.
              getCorreiosServicesByIdEct(service.id);
            var correiosServiceData = {
              id_ect: service.id,
              code: service.codigo,
              description: service.descricao,
              category: service.servicoSigep.categoriaServico
            };
            if (!correios_service) {
              let new_service = await this.correiosRepository.
                insertCorreiosService(correiosServiceData);

              if (correiosClient)
                await this.correiosRepository.createRelationshipServiceClient(correiosClient.id, new_service.id);
            } else {
              await this.correiosRepository.updateCorreiosServicesByIdEct(correios_service.id_ect, correiosServiceData);

              let is_relationship = await this.correiosRepository.getCorreiosServicesClients(correiosClient.id, correios_service.id);
              if (!is_relationship) {
                await this.correiosRepository.createRelationshipServiceClient(correiosClient.id, correios_service.id);
              }

              // if (await this.correiosService.hasChangesCorreiosClient(correiosServiceData, correios_service))
              //   console.log('houve mudança > update essa parada');
              // console.log('não houve mudança');
            }

            response.push({
              cartao: card.numero,
              codigo: service.codigo,
              id: service.id,
              descricao: service.descricao,
              categoria: service.servicoSigep.categoriaServico
            });
          }
        }
      }
    }

    return 200;
  }
}

module.exports = CorreiosBs;
