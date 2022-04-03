'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_shipping_settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      company: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      service: {
        type: DataTypes.ENUM('SEDEX', 'SEDEXCOBRAR', 'PAC', 'PACCOBRAR', 'SEDEX10', 'SEDEX12', 'SEDEXHOJE'),
        allowNull: true
      },
      format: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      origin_zipcode: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      self_hand: {
        type: DataTypes.ENUM('s', 'n'),
        allowNull: true
      },
      delivery_advicemment: {
        allowNull: false,
        type: DataTypes.ENUM('s', 'n'),
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
    });

  },
  down: (migration) => {
    return migration.dropTable('machine_shipping_settings');
  }
};
