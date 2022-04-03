'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('machine_clients', 'blocked_at', {
      }, {
        transaction
      },
      );
      await queryInterface.removeColumn('machine_clients', 'machine_id', {
      }, {
        transaction
      },
      );
      await queryInterface.removeColumn('machine_clients', 'status', {
      }, {
        transaction
      },
      );
      await queryInterface.removeColumn('machine_clients', 'user_id', {
      }, {
        transaction
      },
      );
      await queryInterface.removeColumn('machine_clients', 'activated_at', {
      }, {
        transaction
      },
      );
      await queryInterface.changeColumn('machine_clients', 'account_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: 'profile_id',
      }, {
        transaction
      },
      );
      await queryInterface.changeColumn('machine_clients', 'profile_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: 'id',
      }, {
        transaction
      },
      ).then(() => {
        return queryInterface.addIndex('machine_clients', ['profile_id', 'account_id'], { unique: true });
      });

      await transaction.commit();
      return Promise.resolve();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  },

  down: async (queryInterface) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('machine_clients',
        'machine_orders_id', {
        transaction
      });
      await transaction.commit();
      return Promise.resolve();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  }
};
