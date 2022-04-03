'use strict';

module.exports = {
  up: async (migration, DataTypes) => {
    let transaction = await migration.sequelize.transaction();
    try {
      await migration.changeColumn('machine_order_shipping', 'package_width', {
        type: DataTypes.INTEGER,
        allowNull: true,
      }, {
        transaction
      });

      await migration.changeColumn('machine_order_shipping', 'package_height', {
        type: DataTypes.INTEGER,
        allowNull: true,
      }, {
        transaction
      });

      await migration.changeColumn('machine_order_shipping', 'package_length', {
        type: DataTypes.INTEGER,
        allowNull: true,
      }, {
        transaction
      });

      await migration.changeColumn('machine_order_shipping', 'package_weight', {
        type: DataTypes.INTEGER,
        allowNull: true,
      }, {
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
  },

  down: async (migration, DataTypes) => {
    let transaction = await migration.sequelize.transaction();
    try {
      await migration.changeColumn('machine_order_shipping', 'package_width', {
        type: DataTypes.INTEGER,
        allowNull: false
      }, {
        transaction
      });

      await migration.changeColumn('machine_order_shipping', 'package_height', {
        type: DataTypes.INTEGER,
        allowNull: false,
      }, {
        transaction
      });

      await migration.changeColumn('machine_order_shipping', 'package_length', {
        type: DataTypes.INTEGER,
        allowNull: false,
      }, {
        transaction
      });

      await migration.changeColumn('machine_order_shipping', 'package_weight', {
        type: DataTypes.INTEGER,
        allowNull: false,
      }, {
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
