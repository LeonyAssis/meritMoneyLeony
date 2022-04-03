'use strict';

class CommercialWalletAccountsActivateRepository {

  constructor(params) {
    this.db = params.sequelize;
    this.interval_days = params.constants.COMMERCIAL_WALLET.ACCOUNTS_ACTIVATE.INTERVAL_DAYS;
    this.number_receipts = params.constants.COMMERCIAL_WALLET.ACCOUNTS_ACTIVATE.NUMBER_RECEIPTS;
    this.number_emissions = params.constants.COMMERCIAL_WALLET.ACCOUNTS_ACTIVATE.NUMBER_EMISSIONS;
  }

  async getDocumentsRecentlyAdded(req) {

    if (req.interval_days != undefined && !isNaN(req.interval_days))
      this.interval_days = req.interval_days;

    const Op = this.db.Sequelize.Op;
    var dt = new Date();
    dt.setDate(dt.getDate() - this.interval_days);

    const options = {
      attributes: ['id'],
      where: {
        created_at: {
          [Op.gte]: dt
        }
      },
      order: [
        ['id', 'ASC']
      ],
      raw: true,
      logging: false
    };

    return this.db.core
      .document
      .findAll(options);
  }

  async getAccountsByDocumentIds(documentsIds) {

    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: ['number'],
      where: {
        document_id: {
          [Op.in]: documentsIds
        }
      },
      include: [{
          model: this.db.core.document,
          attributes: ['id'],
          required: true,
        },
        {
          model: this.db.core.user,
          attributes: ['id'],
          where: {
            role: 'admin'
          }
        },
        {
          model: this.db.core.account_settings,
          attributes: ['id'],
          where: {
            is_test: {
              [Op.ne]: 1
            }
          }
        }
      ],
      order: [
        ['id', 'ASC']
      ],
      raw: true
    };

    return this.db.core
      .account
      .findAll(options);
  }

  async getAccountsByNumberReceipts(req, accountsNumbers) {
    if (req.number_receipts != undefined && !isNaN(req.number_receipts))
      this.number_receipts = req.number_receipts;

    const options = {
      attributes: ['account', [this.db.Sequelize.fn('SUM', this.db.Sequelize.col('transactions_amount')), 'sum']],
      where: {
        account: {
          [this.db.Sequelize.Op.in]: accountsNumbers
        }
      },
      group: ['account'],
      order: [
        ['transactions_amount', 'DESC']
      ],
      having: this.db.Sequelize.literal(`SUM(transactions_amount) <= ${this.number_receipts}`),
      raw: true
    };

    return this.db.reports
      .account_transactions_reports_federated
      .findAll(options);
  }

  async getAccountsByNumberEmissions(req, accountNumbers) {

    if (req.number_emissions != undefined && !isNaN(req.number_emissions))
      this.number_emissions = req.number_emissions;

    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: ['account'],
      where: {
        account: {
          [Op.in]: accountNumbers
        }
      },
      group: ['account'],
      having: this.db.Sequelize.literal(`SUM(emissions_amount) >= ${this.number_emissions}`),
      order: [
        ['emissions_amount', 'DESC']
      ],
      raw: true
    };

    return this.db.reports
      .account_emissions_reports_federated
      .findAll(options);
  }

  async getDocumentsIdByAccountNumber(accounts) {

    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: ['number', 'document_id'],
      where: {
        number: {
          [Op.in]: accounts
        }
      },
      raw: true
    };

    return this.db.core
      .account
      .findAll(options);
  }

  async getProfileDocuments(documents, documentsIgnored) {

    const options = {
      attributes: ['id', 'profile_id'],
      where: this.db.Sequelize.literal('document.id in(' + documents + ') and profile.cpf not in(' + documentsIgnored + ')'),
      include: [{
        model: this.db.core.profile,
        attributes: ['cpf', 'name'],
        required: true
      }],
      order: [
        ['id', 'ASC']
      ],
      raw: true
    };

    return this.db.core
      .document
      .findAll(options);
  }

  async getCorporationDocuments(documents, documentsIgnored) {

    const options = {
      attributes: ['id', 'corporation_id', 'profile_id'],
      where: this.db.Sequelize.literal('document.id in(' + documents + ') and corporation.cnpj not in(' + documentsIgnored + ')'),
      include: [{
        model: this.db.core.corporation,
        attributes: ['cnpj', 'name'],
        required: true,
      }],
      order: [
        ['id', 'ASC']
      ],
      raw: true
    };

    return this.db.core
      .document
      .findAll(options);
  }

  async getAllDocumentsCrm() {

    const options = {
      attributes: ['documento'],
      raw: true
    };

    return this.db
      .bi_intranet
      .crm
      .findAll(options);
  }

  async getDocumentsInCommercialWallet() {
    const Op = this.db.Sequelize.Op;
    var dt = new Date();
    const options = {
      attributes: ['document'],
      where: {
        end_date: {
          [Op.gt]: dt
        }
      },
      raw: true
    };

    return this.db.main
      .commercial_wallets
      .findAll(options);
  }

  async getCommercialAnalysts() {

    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: ['user_id'],
      where: {
        [Op.and]: [{
            master: 0
          },
          {
            assignment: 1
          }
        ]
      },
      include: [{
        model: this.db.intranet.user,
        attributes: ['email'],
        required: true,
        where: {
          roles_mask: {
            [Op.ne]: 2
          }

        }
      }],
      order: [
        ['id', 'DESC']
      ],
      raw: true
    };

    return this.db.intranet
      .commercial_analyst
      .findAll(options);
  }

  async verifyAnalystByProfileId(profileId) {

    const options = {
      attributes: ['responsible_analyst', 'profile_id'],
      where: {
        profile_id: profileId
      },
      order: [
        ['id', 'DESC']
      ],
      raw: true
    };

    return this.db.main
      .commercial_wallets
      .findAll(options);
  }

  async createCommercialWallet(createdCommercialWallet, analyst, type, reference_value) {
    var startDate = new Date();
    var EndDate = new Date();
    EndDate.setMonth(startDate.getMonth() + 10);

    const commercialWallet = {
      profile_id: createdCommercialWallet.profile_id,
      document_id: createdCommercialWallet.document_id,
      document: createdCommercialWallet.document,
      type: type,
      name: createdCommercialWallet.name,
      reference_value: reference_value,
      responsible_analyst: analyst,
      start_date: startDate,
      end_date: EndDate,
      created_at: startDate,
      updated_at: startDate
    };

    return this.db.main
      .commercial_wallets
      .create(commercialWallet);
  }
}

module.exports = CommercialWalletAccountsActivateRepository;
