'use strict';

const sinon = require('sinon');
const TransactionService = require('../../../app/adapters/services/transaction.service');

const params = {
  sequelize: {
    main: {
      sequelize: {
        transaction: sinon.stub(),
        commit: sinon.stub(),
        rollback: sinon.stub(),
      }
    },
  }
};

const t = {
  commit: sinon.stub(),
  rollback: sinon.stub(),
};

describe('transaction service', () => {
  let service;

  beforeEach(() => {
    service = new TransactionService(params);
  });

  describe('startTransaction', () => {
    it('should start a transaction', async () => {
      await service.startTransaction();
    });
  });

  describe('commitTransaction', () => {
    it('should not commit a transaction', async () => {
      await service.commitTransaction();
    });

    it('should commit a transaction', async () => {
      await service.commitTransaction(t);
    });
  });

  describe('rollbackTransaction', () => {
    it('should not rollback a transaction', async () => {
      await service.rollbackTransaction();
    });

    it('should rollback a transaction', async () => {
      await service.rollbackTransaction(t);
    });
  });
});
