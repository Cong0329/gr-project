const { allow } = require("joi");

module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        rating: { type: DataTypes.DECIMAL(2, 1), allowNull: false },
        comment: { type: DataTypes.TEXT, allowNull: false },
    }, {
        tableName: 'review',
        timestapms: true
    });
    Review.associate = (models) => {
        Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Review.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
        Review.hasOne(models.ReviewReply, { foreignKey: 'review_id', as: 'reply' });
    };
    return Review;
};