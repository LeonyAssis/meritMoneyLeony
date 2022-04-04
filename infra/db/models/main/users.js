'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

    });
};
