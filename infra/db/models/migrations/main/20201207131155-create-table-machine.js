'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      serial_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      machine_model_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      machine_chip_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      invoice: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      description: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('working', 'analyse', 'defect', 'discarded'),
        allowNull: false,
        defaultValue: 'working'
      },
      has_partner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      has_client: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      blocked_at: {
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
    return migration.dropTable('machines');
  }
};
