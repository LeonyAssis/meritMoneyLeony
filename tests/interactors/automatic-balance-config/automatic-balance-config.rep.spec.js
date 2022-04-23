'use strict';

const sinon = require('sinon');
const AutomaticBalanceRepository = require(
  '../../../app/interactors/automatic-balance-config/automatic-balance-config.rep'
);

describe('automaticBalanceRepository', () => {
  let automaticBalanceRepository;
  const literal = String;

  const params = {

    sequelize: {
      Sequelize: {
        literal: literal,
      },
      main: {
        automatic_balance_execution_status: {
          update: sinon.stub(),
          findOne: sinon.stub(),
          get: sinon.stub(),
          create: sinon.stub(),
          get: sinon.stub(),
        },
        automatic_balance_execution_user_history: {
          create: sinon.stub(),
        },
        automatic_balance_config: {
          findAll: sinon.stub(),
        }
      },
    },
  };

  beforeEach(() => {
    sinon.reset();
    automaticBalanceRepository = new AutomaticBalanceRepository(params);
  });

  describe('automaticBalanceRep', () => {

    it('should get config', async () => {
      await automaticBalanceRepository
        .getConfig();
    });

    it('should get Execution Status', async () => {
      await automaticBalanceRepository
        .getExecutionStatus();
    });

    it('should create Execution', async () => {
      await automaticBalanceRepository
        .createExecution({
          choose_date: '2022-04-22',
          value: 5000,
          status: 'EXECUTING',
        });
    });

    it('should update Execution', async () => {
      await automaticBalanceRepository
        .updateExecution(14, { raw: true });
    });

    it('should create Execution User History', async () => {
      await automaticBalanceRepository
        .createExecutionUserHistory({ user_id: 12, automatic_balance_id: 14 });
    });
  });
});
