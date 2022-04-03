'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_chips', {
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
      allowNull: false
    },
    chip_number: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    machine_chip_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gn_purchase_invoice: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('available', 'linked', 'defect'),
      allowNull: false
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
    defect_reported_by: {
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
