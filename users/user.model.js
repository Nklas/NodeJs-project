const { DataTypes } = require('sequelize');

module.exports = model;

// creation of db
function model(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false },
        hash: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: true },
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            withHash: { attributes: {}, },
        },

        timestamps: false, // avoid creation of createdAt fields
    };

    return sequelize.define('User', attributes, options);
}