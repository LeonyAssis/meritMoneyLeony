'use strict';

const sinon = require('sinon');
const fail = require('../../fail');
const AutomaticBalanceBs = require(
  '../../../app/interactors/automatic-balance/automatic-balance.bs'
);


let automaticBalanceBs;

const params = {
  automaticBalanceConfigRepository: {
    getConfig: sinon.stub(),
    getExecutionStatus: sinon.stub(),
    createExecution: sinon.stub(),
    createExecutionUserHistory: sinon.stub(),
    updateExecution: sinon.stub(),
  },
  balanceRepository: {
    getBalanceAndUsers: sinon.stub(),
    updateUserBalance: sinon.stub(),
  },
  balanceHistoryRepository: {
    createBalanceHistory: sinon.stub(),
  },
  transactionService: {
    startTransaction: sinon.stub(),
    commitTransaction: sinon.stub(),
    rollbackTransaction: sinon.stub()
  },
  validatorService: {
    execute: sinon.stub()
  },
  errorService: {
    get: sinon.stub()
  },
  formatService: {
    formatObjectByProperty: sinon.stub()
  }
};

describe('AutomaticBalanceBs', () => {

  beforeEach(() => {
    sinon.reset();
    automaticBalanceBs = new AutomaticBalanceBs(params);
  });


  describe('getConfig()', () => {
    it('should get configuration for automatic balance', async () => {
      params.automaticBalanceConfigRepository
        .getConfig
        .resolves([
          {
            id: 7,
            value: 5000,
            day_to_send_balance: 22,
            last_user_set: 12,
            created_at: '2022-04-21T14:38:57.000Z',
            updated_at: '2022-04-21T14:38:57.000Z'
          }
        ]);
      await automaticBalanceBs.getConfig();
    });
  });

  describe('skipOrExecuteAutomaticBalance()', () => {
    it('should skip automatic balance', async () => {
      params.automaticBalanceConfigRepository
        .getExecutionStatus
        .resolves({
          id: 7,
          value: 5000,
          last_user_set: 22,
          day_to_send_balance: 20,
          created_at: '2022-04-21T14:38:57.000Z',
          updated_at: '2022-04-21T14:38:57.000Z'
        });

      await automaticBalanceBs.skipOrExecuteAutomaticBalance();

    });

    it('should execute automatic balance and register users with error', async () => {
      params.automaticBalanceConfigRepository
        .getExecutionStatus
        .resolves(null);

      params.automaticBalanceConfigRepository
        .createExecution
        .resolves({
          id: 14,
          choose_date: '2022-04-21',
          value: 5000,
          status: 'EXECUTING',
          error_users: [],
          created_at: '2022-04-21T14:38:57.000Z',
          updated_at: '2022-04-21T14:38:57.000Z'
        });

      params.automaticBalanceConfigRepository
        .createExecution
        .resolves({
          id: 14,
          choose_date: '2022-04-21',
          value: 5000,
          status: 'EXECUTING',
          error_users: [],
          created_at: '2022-04-21T14:38:57.000Z',
          updated_at: '2022-04-21T14:38:57.000Z'
        });

      params.balanceRepository
        .getBalanceAndUsers
        .resolves([
          {
            "id": 11,
            "name": "Euzin",
            "email": "euzin@outlook.com.br",
            "role_id": null,
            "created_at": "2022-04-19T21:14:57.786Z",
            "updated_at": "2022-04-19T21:14:57.786Z"
          },
          {
            "id": 10,
            "name": "Test 03-04 4",
            "email": "test@test.com.br",
            "role_id": null,
            "created_at": "2022-04-19T21:14:08.420Z",
            "updated_at": "2022-04-19T23:12:04.804Z"
          }
        ]);

      params.balanceRepository
        .updateUserBalance
        .throws();

      await automaticBalanceBs.skipOrExecuteAutomaticBalance({ value: 5000 });

    });

    it('should execute automatic balance', async () => {
      params.automaticBalanceConfigRepository
        .getExecutionStatus
        .resolves(null);

      params.automaticBalanceConfigRepository
        .createExecution
        .resolves({
          id: 14,
          choose_date: '2022-04-21',
          value: 5000,
          status: 'EXECUTING',
          error_users: [],
          created_at: '2022-04-21T14:38:57.000Z',
          updated_at: '2022-04-21T14:38:57.000Z'
        });

      params.automaticBalanceConfigRepository
        .createExecution
        .resolves({
          id: 14,
          choose_date: '2022-04-21',
          value: 5000,
          status: 'EXECUTING',
          error_users: [],
          created_at: '2022-04-21T14:38:57.000Z',
          updated_at: '2022-04-21T14:38:57.000Z'
        });

      params.balanceRepository
        .getBalanceAndUsers
        .resolves([
          {
            "id": 11,
            "name": "Euzin",
            "email": "euzin@outlook.com.br",
            "role_id": null,
            "created_at": "2022-04-19T21:14:57.786Z",
            "updated_at": "2022-04-19T21:14:57.786Z"
          },
          {
            "id": 10,
            "name": "Test 03-04 4",
            "email": "test@test.com.br",
            "role_id": null,
            "created_at": "2022-04-19T21:14:08.420Z",
            "updated_at": "2022-04-19T23:12:04.804Z"
          }
        ]);

      params.balanceRepository
        .updateUserBalance
        .resolves(20, { balance: 10000 });

      await automaticBalanceBs.skipOrExecuteAutomaticBalance({ value: 5000 });

    });

    // it('should check if the commercial size is different from undefined', async () => {

    //   params.commercialWalletRepository
    //     .documentCommercialSizeIntranet
    //     .resolves(20);

    //   await commercialWalletBs.create(req);

    // });
    // it('should check if the commercial size is different from undefined', async () => {

    //   params.commercialWalletRepository
    //     .documentCommercialSizeIntranet
    //     .resolves(20);

    //   await commercialWalletBs.create(req_error_schema2);

    // });
  });


});
