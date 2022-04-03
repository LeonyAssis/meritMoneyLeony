'use strict';

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('machines', {
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
    machine_manufacturer_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    machine_client_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gn_purchase_invoice: {
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
      type: DataTypes.ENUM('in_stock', 'actived', 'inactived', 'defected', 'discarded'),
      allowNull: false,
      defaultValue: 'in_stock'
    },
    business_type: {
      type: DataTypes.ENUM('rent', 'buy'),
      allowNull: true,
      defaultValue: null
    },
    is_working: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    defect: {
      type: DataTypes.VIRTUAL,
      get() {
        return this._defect;
      },
      set(value) {
        this._defect = value;
      }
    },
    discarded: {
      type: DataTypes.VIRTUAL,
      get() {
        return this._discarded;
      },
      set(value) {
        this._discarded = value;
      }
    },
    warranty: {
      type: DataTypes.VIRTUAL,
      get() {
        return this._warranty;
      },
      set(value) {
        this._warranty = value;
      }
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
