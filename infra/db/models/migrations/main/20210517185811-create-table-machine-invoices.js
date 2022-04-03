'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      invoice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      machine_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      machine_invoice_types_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        type: DataTypes.DATE
      }
    }).then(() => {
      return migration.addIndex('machine_invoices', ['machine_invoice_types_id']);
    }).then(() => {
      return migration.addIndex('machine_invoices', ['machine_order_id']);
    });
  },

  down: (migration) => {
    return migration.dropTable('machine_invoices');
  }
};
