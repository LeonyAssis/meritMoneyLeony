'use strict';

const Interactor = require('../interactor.bs');

class CommercialWalletAccountsActivateBs extends Interactor {

  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.dateService = params.dateService;
    this.commercialWalletAccountsActivateService = params.commercialWalletAccountsActivateService;
    this.commercialWalletAccountsActivateRepository = params.commercialWalletAccountsActivateRepository;
  }

  async execute(req) {
    let first_business_day = await this.dateService.is_first_business_day(new Date());
    let is_interval_hour = await this.dateService.is_interval_hour(new Date(), [1, 0, 0], [1, 30, 0]);

    if (req.manual == undefined) {
      if (!first_business_day || !is_interval_hour)
        throw this.errorService
          .get('not_first_business_day');
    }

    const documentsAddedRecentlyIds = await this.commercialWalletAccountsActivateRepository
      .getDocumentsRecentlyAdded(req)
      .then(res => {
        return this.commercialWalletAccountsActivateService
          .formatObjectByProperty(res, 'id');
      });

    if (documentsAddedRecentlyIds.length <= 0)
      throw this.errorService
        .get('documents_not_found');

    let accountNumbersOfdocumentsAddedRecently = await this.commercialWalletAccountsActivateRepository
      .getAccountsByDocumentIds(documentsAddedRecentlyIds)
      .then(res => {
        return this.commercialWalletAccountsActivateService
          .formatObjectByProperty(res, 'number');
      });

    if (accountNumbersOfdocumentsAddedRecently.length <= 0)
      throw this.errorService
        .get('accounts_not_found');

    let accountList = [];
    let accountNumbersByNumberEmissionsAndReceipts = await this.commercialWalletAccountsActivateRepository
      .getAccountsByNumberEmissions(req, accountNumbersOfdocumentsAddedRecently)
      .then((res) => {
        return this.commercialWalletAccountsActivateService
          .formatObjectByProperty(res, 'account');
      })
      .then(async res => {
        return await this.commercialWalletAccountsActivateRepository
          .getAccountsByNumberReceipts(req, res)
          .then(res => {
            let accountNumbers = [];
            res.forEach(doc => {
              accountList.push(doc);
              accountNumbers.push(doc.account);
            });
            return accountNumbers;
          });
      });

    if (accountNumbersByNumberEmissionsAndReceipts.length <= 0)
      throw this.errorService
        .get('accounts_not_found');

    const documentIdsByAccountNumber = await this.commercialWalletAccountsActivateRepository
      .getDocumentsIdByAccountNumber(accountNumbersByNumberEmissionsAndReceipts)
      .then(res => {
        let accountNumbers = [];
        res.forEach(doc => {
          let data = accountList.find(data => data.account === doc.number);
          if (data != undefined) {
            data.document_id = doc.document_id;
          }
          accountNumbers.push(doc.document_id);
        });
        return accountNumbers;
      });

    if (documentIdsByAccountNumber.length <= 0)
      throw this.errorService
        .get('documents_not_found');

    let profilesIds = [];
    let documentsIgnored = await this.getIgnoredDocuments();
    await this.commercialWalletAccountsActivateRepository
      .getProfileDocuments(documentIdsByAccountNumber, documentsIgnored)
      .then(res => {
        return res.forEach(doc => {
          let documents = accountList.filter(data => data.document_id === doc.id);
          documents.forEach(data => {
            if (!profilesIds.includes(doc.profile_id))
              profilesIds.push(doc.profile_id);

            data.profile_id = doc.profile_id;
            data.cpf = doc['profile.cpf'];
            data.profile_name = doc['profile.name'];
          });
        });
      });

    profilesIds.concat(await this.commercialWalletAccountsActivateRepository
      .getCorporationDocuments(documentIdsByAccountNumber, documentsIgnored)
      .then(res => {
        return res.forEach(doc => {
          let documents = accountList.filter(data => data.document_id === doc.id);
          documents.forEach(data => {
            if (!profilesIds.includes(doc.profile_id))
              profilesIds.push(doc.profile_id);

            data.profile_id = doc.profile_id;
            data.cnpj = doc['corporation.cnpj'];
            data.corporation_name = doc['corporation.name'];
          });
        });
      }));

    if (profilesIds.length <= 0)
      throw this.errorService
        .get('documents_not_found');

    await this.createCommercialWalletByDocuments(accountList, profilesIds);

  }

  async getIgnoredDocuments() {
    let documentsIdsToIgnore = await this.commercialWalletAccountsActivateRepository
      .getAllDocumentsCrm()
      .then(res => {
        let documents = [];
        res.forEach(doc => {
          documents.push(doc.documento);
        });
        return documents;
      });

    return documentsIdsToIgnore.concat(await this.commercialWalletAccountsActivateRepository
      .getDocumentsInCommercialWallet()
      .then(res => {
        let documents = [];
        res.forEach(doc => {
          documents.push(doc.document);
        });
        return documents;
      })
    ).reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
  }

  async createCommercialWalletByDocuments(accountList, profilesIds) {
    for (let profile of profilesIds) {
      let data = accountList.find(data => data.profile_id === profile);
      if (data.cpf != undefined)
        await this.createCommercialWallet(data, data.cpf, null, data.profile_name);

      if (data.cnpj != undefined)
        await this.createCommercialWallet(data, data.cnpj, null, data.corporation_name);
    }
  }

  async createCommercialWallet(data, document, emailAnalyst, name) {
    let createdCommercialWallet = {};
    createdCommercialWallet.profile_id = data.profile_id;
    createdCommercialWallet.document_id = data.document_id;
    createdCommercialWallet.document = document;
    createdCommercialWallet.name = name;

    return await this.commercialWalletAccountsActivateRepository
      .createCommercialWallet(createdCommercialWallet, emailAnalyst, 'conta_ativar', 0);
  }

}

module.exports = CommercialWalletAccountsActivateBs;
