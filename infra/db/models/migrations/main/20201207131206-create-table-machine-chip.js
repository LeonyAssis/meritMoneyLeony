'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_chips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      carrier_chip: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      sim_card_serial: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
      },
      chip_number: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      machine_chip_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      invoice: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      linked_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      defect_at: {
        type: DataTypes.DATE,
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
    });
  },
  down: (migration) => {
    return migration.dropTable('machine_chips');
  }
};
