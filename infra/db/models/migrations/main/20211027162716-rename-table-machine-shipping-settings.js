'use strict';

module.exports = {
  up: async (migration, DataTypes) => {
    let transaction = await migration.sequelize.transaction();
    try {
      await migration.renameTable('machine_shipping_settings', 'machine_general_shipping_settings');

      await migration.addColumn('machine_general_shipping_settings', 'pac_correios_client_service_id', {
        type: DataTypes.INTEGER,
        allowNull: true,
        after: 'type_tracking_insertion'
      }, {
        transaction
      });

      await migration.addColumn('machine_general_shipping_settings', 'sedex_correios_client_service_id', {
        type: DataTypes.INTEGER,
        allowNull: true,
        after: 'pac_correios_client_service_id'
      }, {
        transaction
      });

      await migration.changeColumn('machine_general_shipping_settings', 'company', {
        type: DataTypes.STRING(45),
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
      await migration.renameTable('machine_general_shipping_settings', 'machine_shipping_settings');

      await migration.removeColumn('machine_shipping_settings', 'pac_correios_client_service_id', { transaction });

      await migration.removeColumn('machine_shipping_settings', 'sedex_correios_client_service_id', { transaction });

      await migration.changeColumn('machine_shipping_settings', 'company', {
        type: DataTypes.STRING(45),
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
