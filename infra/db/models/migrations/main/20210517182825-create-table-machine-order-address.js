'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_order_address', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      street: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      reference: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      neighborhood: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      zipcode: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(45),
        allowNull: false,
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
    return migration.dropTable('machine_order_address');
  }
};
