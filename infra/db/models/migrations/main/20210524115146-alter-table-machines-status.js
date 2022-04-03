'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.changeColumn('machines', 'status', {
        type: Sequelize.ENUM('in_stock', 'actived', 'inactived', 'defected', 'discarded'),
        defaultValue: 'in_stock',
        allowNull: false,
      }, {
        transaction
      }, );

      await queryInterface.renameColumn('machines', 'warranty_at', 'is_working', {}, {
        transaction
      }, );

      await queryInterface.changeColumn('machines', 'is_working', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }, {
        transaction
      }, );

      await queryInterface.removeColumn('machines', 'activated_at', {}, {
        transaction
      }, );

      await queryInterface.removeColumn('machines', 'blocked_at', {}, {
        transaction
      }, );

      await transaction.commit();
      return Promise.resolve();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    await queryInterface.changeColumn('machines', 'status', {
      type: Sequelize.ENUM('working', 'analyse', 'defect', 'repaired', 'discarded', 'warranty', 'blocked'),
      defaultValue: 'working'
    }, {
      transaction
    }, );

    await queryInterface.renameColumn('machines', 'is_working', 'warranty_at', {
      type: Sequelize.DATE
    }, {
      transaction
    }, );

    await queryInterface.changeColumn('machines', 'warranty_at', {
      type: Sequelize.DATE
    }, {
      transaction
    }, );

    await queryInterface.addColumn('machines', 'activated_at', {
      type: Sequelize.DATE
    }, {
      transaction
    }, );

    await queryInterface.addColumn('machines', 'blocked_at', {
      type: Sequelize.DATE
    }, {
      transaction
    }, );
  }
};
