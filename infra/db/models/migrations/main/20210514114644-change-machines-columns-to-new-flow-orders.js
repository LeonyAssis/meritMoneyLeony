'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.renameColumn('machines', 'invoice', 'machine_manufacturer_id', {
      }, {
        transaction
      },
      );
      await queryInterface.renameColumn('machines', 'has_partner', 'business_type', {
      }, {
        transaction
      },
      );
      await queryInterface.renameColumn('machines', 'has_client', 'warranty_at', {
      }, {
        transaction
      },
      );
      await queryInterface.changeColumn('machines', 'status', {
        type: Sequelize.ENUM('working', 'analyse', 'defect', 'repaired', 'discarded', 'warranty', 'blocked'),
        defaultValue: 'working',
        allowNull: false,
      }, {
        transaction
      },
      );
      await queryInterface.addColumn('machines', 'gn_purchase_invoice', {
        type: Sequelize.STRING(45),
        allowNull: true,
        after: 'user_id'
      }, {
        transaction
      },
      );
      await queryInterface.addColumn('machines', 'activated_at', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'user_id'
      }, {
        transaction
      },
      );
      await queryInterface.addColumn('machines', 'machine_client_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'machine_chip_id'
      }, {
        transaction
      },
      );
      await queryInterface.changeColumn('machines', 'business_type', {
        type: Sequelize.ENUM('rent', 'buy'),
        defaultValue: null
      }, {
        transaction
      },
      );
      await queryInterface.changeColumn('machines', 'machine_manufacturer_id', {
        type: Sequelize.INTEGER,
        allowNull: false,

      }, {
        transaction
      },
      ).then(() => {
        return queryInterface.addIndex('machines', ['machine_manufacturer_id']);
      }).then(() => {
        return queryInterface.addIndex('machines', ['machine_chip_id']);
      }).then(() => {
        return queryInterface.addIndex('machines', ['machine_model_id']);
      }).then(() => {
        return queryInterface.addIndex('machines', ['machine_client_id']);
      });

      await queryInterface.changeColumn('machines', 'warranty_at', {
        type: Sequelize.DATE,
        after: 'user_id'
      }, {
        transaction
      },
      );

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
      await queryInterface.renameColumn('machines', 'machine_manufacturer_id', 'invoice', {
      }, {
        transaction
      },
      );
      await queryInterface.renameColumn('machines', 'business_type', 'has_partner', {
      }, {
        transaction
      },
      );
      await queryInterface.renameColumn('machines', 'warranty_at', 'has_client', {
      }, {
        transaction
      },
      );
      await transaction.commit();
      return Promise.resolve();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  },
};
