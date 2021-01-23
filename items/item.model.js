const { DataTypes } = require('sequelize');

module.exports = model;

// creation of db
function model(sequelize) {
    const attributes = {
        title: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.INTEGER, allowNull: false },
        image: { type: DataTypes.STRING, allowNull: true },
        user_id: { type: DataTypes.INTEGER, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: true },
    };

    const options = {
        defaultScope: {
            attributes: {}
        },
        scopes: {},
        timestamps: false, // avoid creation of created_at fields
    };

    return sequelize.define('Item', attributes, options);
}