'use strict';

const sinon = require('sinon');
const AutomaticBalanceConfigRepository = require(
  '../../../app/interactors/automatic-balance-config/automatic-balance-config.rep'
);

describe('automaticBalanceConfigRepository', () => {
  let automaticBalanceConfigRepository;
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
          findOne: sinon.stub(),
          update: sinon.stub(),
        }
      },
    },
  };

  beforeEach(() => {
    sinon.reset();
    automaticBalanceConfigRepository = new AutomaticBalanceConfigRepository(params);
  });

  describe('automaticBalanceRep', () => {

    it('should get config', async () => {
      await automaticBalanceConfigRepository
        .getConfig();
    });

    it('should get config', async () => {
      await automaticBalanceConfigRepository
        .updateConfig(10, {});
    });


    it('should get Execution Status', async () => {
      await automaticBalanceConfigRepository
        .getExecutionStatus();
    });

    it('should create Execution', async () => {
      await automaticBalanceConfigRepository
        .createExecution({
          choose_date: '2022-04-22',
          value: 5000,
          status: 'EXECUTING',
        });
    });

    it('should update Execution', async () => {
      await automaticBalanceConfigRepository
        .updateExecution(14, { raw: true });
    });

    it('should create Execution User History', async () => {
      await automaticBalanceConfigRepository
        .createExecutionUserHistory({ user_id: 12, automatic_balance_id: 14 });
    });
  });
});
