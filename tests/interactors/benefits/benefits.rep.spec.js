'use strict';

const sinon = require('sinon');
const BenefitsRepository = require(
  '../../../app/interactors/benefits/benefits.rep'
);

describe('benefitsRepository', () => {
  let benefitsRepository;

  const params = {
    sequelize: {
      main: {
        benefits: {
          findOne: sinon.stub(),
          upsert: sinon.stub(),
          update: sinon.stub(),
          findAndCountAll: sinon.stub(),
        },
      },
    },
  };

  beforeEach(() => {
    sinon.reset();
    benefitsRepository = new BenefitsRepository(params);
  });

  describe('getBenefits()', () => {
    it('should get benefits without sorting', async () => {
      await benefitsRepository
        .getBenefits({}, {}, {});
    });

    it('should get benefits with sorting', async () => {
      await benefitsRepository
        .getBenefits({ limit: 5 }, {}, ['created_at', 'desc']);
    });
  });

  describe('getBenefit()', () => {
    it('should get one benefits', async () => {
      await benefitsRepository
        .getBenefit({ id: 5 });
    });
  });

  describe('upsertBenefits()', () => {
    it('should upsert Benefits', async () => {
      await benefitsRepository
        .upsertBenefits({ id: 5, name: 'Test', value: 5000, user_id: 999 });
    });
  });

  describe('upsertBenefits()', () => {
    it('should update Benefit', async () => {
      await benefitsRepository
        .updateBenefit({ name: 'Test 2', value: 5000, user_id: 999 });
    });
  });




});
