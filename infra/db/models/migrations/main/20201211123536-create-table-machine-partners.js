'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_partners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      profile_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    return migration.dropTable('machine_partners');
  }
};
