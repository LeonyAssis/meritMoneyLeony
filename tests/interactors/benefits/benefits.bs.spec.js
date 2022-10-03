'use strict';

const sinon = require('sinon');
const fail = require('../../fail');
const BenefitsBs = require(
  '../../../app/interactors/benefits/benefits.bs'
);


let benefitsBs;

const params = {
  benefitsRepository: {
    getBenefits: sinon.stub(),
    getBenefit: sinon.stub(),
    upsertBenefits: sinon.stub(),
    updateBenefit: sinon.stub(),
  },
  balanceRepository: {
    getBalance: sinon.stub(),
    updateBalance: sinon.stub(),
  },
  balanceHistoryRepository: {
    createBalanceHistory: sinon.stub(),
  },
  benefitsService: {
    mountOpts: sinon.stub(),
  },
  transactionService: {
    startTransaction: sinon.stub(),
    commitTransaction: sinon.stub(),
    rollbackTransaction: sinon.stub(),
  },
  validatorService: {
    execute: sinon.stub()
  },
  errorService: {
    get: sinon.stub()
  }
};

describe('BenefitsBs', () => {

  beforeEach(() => {
    sinon.reset();
    benefitsBs = new BenefitsBs(params);
  });


  describe('getBenefits()', () => {
    it('Should get balance for an user', async () => {

      params.benefitsService
        .mountOpts
        .resolves({}, {}, {});

      params.benefitsRepository
        .getBenefits
        .resolves({ id: 14 });

      await benefitsBs.getBenefits({ query: {} });
    });
  });

  describe('getBenefit()', () => {
    it('Should throw error id required', async () => {
      try {
        await benefitsBs.getBenefit({ params: {} });
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('id_required');
      }
    });

    it('Should throw error benefit not found', async () => {

      params.benefitsRepository
        .getBenefit
        .resolves(null);

      try {
        await benefitsBs.getBenefit({ params: { id: 5 } });
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('benefit_not_found');
      }
    });

    it('Should return benefit', async () => {
      params.benefitsRepository
        .getBenefit
        .resolves({ id: 5, name: 'Test' });

      await benefitsBs.getBenefit({ params: { id: 5 } });
    });
  });

  describe('upsertBenefits()', () => {
    it('Should upsert benefits', async () => {
      await benefitsBs.upsertBenefits({ body: { name: 'Ola', value: 50000 } });
    });
  });

  describe('updateBenefits()', () => {
    it('Should throw error benefit not found', async () => {
      params.benefitsRepository
        .getBenefit
        .resolves(null);

      try {
        await benefitsBs.updateBenefits({ params: { id: 5 } });
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('benefit_not_found');
      }
    });

    it('Should update benefit', async () => {
      params.benefitsRepository
        .getBenefit
        .resolves({ id: 5, name: 'Test', value: '10000' });

      await benefitsBs.updateBenefits({ params: { id: 5 } });
    });
  });

  describe('buyBenefits()', () => {
    it('Should throw error benefit not found', async () => {
      params.benefitsRepository
        .getBenefit
        .resolves(null);

      try {
        await benefitsBs.buyBenefits({ body: { benefit_id: 5 } });
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('benefit_not_found');
      }
    });

    it('Should throw error user not found', async () => {
      params.benefitsRepository
        .getBenefit
        .resolves({ id: 5, name: 'Test', value: 10000 });

      params.balanceRepository
        .getBalance
        .resolves(null);

      try {
        await benefitsBs.buyBenefits({ body: { benefit_id: 5, user_id: 11 } });
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('user_not_found');
      }
    });

    it('Should throw error balance is lower than required', async () => {
      params.benefitsRepository
        .getBenefit
        .resolves({ id: 5, name: 'Test', value: 10000 });

      params.balanceRepository
        .getBalance
        .resolves({ id: 2, balance: 1 });

      try {
        await benefitsBs.buyBenefits({ body: { benefit_id: 5, user_id: 11 } });
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('balance_is_lower_than_required');
      }
    });

    it('Should buy benefit', async () => {
      params.benefitsRepository
        .getBenefit
        .resolves({ id: 5, name: 'Test', value: 1 });

      params.balanceRepository
        .getBalance
        .resolves({ id: 2, balance: 1000 });

      params.balanceRepository
        .updateBalance
        .resolves({ id: 2, balance: 1000 });

      await benefitsBs.buyBenefits({ body: { benefit_id: 5, user_id: 11 } });
    });

    it('Should rollback transaction', async () => {
      params.benefitsRepository
        .getBenefit
        .resolves({ id: 5, name: 'Test', value: 1 });

      params.balanceRepository
        .getBalance
        .resolves({ id: 2, balance: 1000 });

      params.balanceRepository
        .updateBalance
        .resolves({ id: 2, balance: 1000 });

      params.balanceHistoryRepository
        .createBalanceHistory
        .throws(new Error());

      try {
        await benefitsBs.buyBenefits({ body: { benefit_id: 5, user_id: 11 } });
      } catch (error) {
        console.log(error);
      }
    });
  });

});
