'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_general_shipping_settings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    company: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    correios_client_service_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    correios_directorship_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sender_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sender_street: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sender_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    sender_neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sender_zipcode: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    sender_city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sender_state: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    sender_phone: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    sender_email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    self_hand: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    delivery_advicemment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    declared_value: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    calc_time_and_cost: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    type_tracking_insertion: {
      type: DataTypes.ENUM('manual', 'automatic'),
      allowNull: false,
      defaultValue: 'manual'
    },
    pac_correios_client_service_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sedex_correios_client_service_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });
};
