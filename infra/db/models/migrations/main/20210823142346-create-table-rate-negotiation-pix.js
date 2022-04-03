'use strict';

module.exports = {

  up: function (migration, DataTypes) {
    return migration.createTable('rate_negotiation_pix', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      rate_negotiations_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tax_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tax_val_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      tax_roof: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      tax_val_money: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rate_negotiation_config_status_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      approver_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      approvation_reason: {
        type: DataTypes.TEXT,
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
      return migration.addIndex('rate_negotiation_pix', ['rate_negotiations_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiation_pix', ['rate_negotiation_config_status_id']);
    });
  },

  down: function (migration) {
    return migration
      .dropTable('rate_negotiation_pix');
  }
};
