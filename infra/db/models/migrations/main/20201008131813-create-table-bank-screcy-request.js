'use strict';
module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('bank_secrecy_requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      origin: {
        type: DataTypes.ENUM,
        values: ['bc_correios', 'ccs'],
        allowNull: false
      },
      document: {
        type: DataTypes.STRING,
        allowNull: false
      },
      control_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      begin_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      judicial_process: {
        type: DataTypes.STRING,
        allowNull: true
      },
      shipping_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      receipt_number: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      receipt_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
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
      return migration.addIndex('bank_secrecy_requests', ['control_number']);
    }).then(() => {
      return migration.addIndex('bank_secrecy_requests', ['document']);
    }).then(() => {
      return migration.addIndex('bank_secrecy_requests', ['user_id']);
    });
  },
  down: function (migration) {
    return migration
      .dropTable('bank_secrecy_requests');
  }
};
