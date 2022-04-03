'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('communication_large_scale_options', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    communication_type: {
      type: DataTypes.ENUM(['ticket', 'sms', 'whatsapp']),
      allowNull: true
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ticket_create_note: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    ticket_owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ticket_queue_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ticket_classification_type_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    ticket_avaliation_status_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    ticket_category_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    ticket_subject_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    ticket_archive: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    type_from: {
      allowNull: true,
      type: DataTypes.ENUM(['account', 'document'])
    },
    video_url: {
      allowNull: true,
      type: DataTypes.STRING
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
