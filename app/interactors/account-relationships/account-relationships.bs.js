'use strict';

const Interactor = require('../interactor.bs');

class AccountRelationshipsBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.moment = params.momentTz;
    this.validator = params.validatorService;
    this.accountRelationshipsRepository = params.accountRelationshipsRepository;
    this.accountRelationshipsService = params.accountRelationshipsService;
  }

  async get(req) {
    let periodForCheck = req.query.period || 1;
    let account = req.params.account;

    let relationships = await this.accountRelationshipsRepository.getAccountRelationships(account);
    if (relationships.length > 0) {
      let needCheck = await this.accountRelationshipsService.checkUpdate(relationships[0].update_at, periodForCheck);

      if (needCheck) {
        let partners = await this.checkNewPartners(account);
        if (partners.length > 0) {
          for (let partner of partners) {
            let partnerRelationship = relationships.find(p => p.partner_id === partner.parceiro_id);
            if (partnerRelationship) {
              let data = {
                last_transaction: partner.data_insercao
              };
              await this.accountRelationshipsRepository.updateAccountRelationship(data, partnerRelationship.id);
            } else {
              await this.insertAccountRelationship(account, partner);
            }
          }
        }
      }
    } else {
      let partners = await this.checkNewPartners(account);
      if (partners.length > 0) {
        for (let partner of partners) {
          await this.insertAccountRelationship(account, partner);
        }
      }
    }
    relationships = await this.accountRelationshipsRepository.getAccountRelationships(account);
    if (relationships.length == 0)
      throw this.errorService
        .get('no_partner_in_account_relationship');
    return relationships;
  }

  async checkNewPartners(account) {
    let transaction_client = await this.accountRelationshipsRepository.getTransactionClient(account);
    if (transaction_client) {
      let partners = await this.accountRelationshipsRepository.getAccountPartners(transaction_client.id);
      return partners;
    }
    return [];
  }

  async insertAccountRelationship(account, partner) {
    let firstTransaction = await this.accountRelationshipsRepository.getFirstTransactionDate(partner.cliente_transacao_id, partner.parceiro_id);
    let accountPartner = {
      relationship_begining: firstTransaction[0].data_insercao,
      account: account,
      responsible: partner.nome,
      partner_id: partner.parceiro_id,
      last_transaction: partner.data_insercao
    };
    await this.accountRelationshipsRepository.createAccountRelationship(accountPartner);
  }

}

module.exports = AccountRelationshipsBs;
