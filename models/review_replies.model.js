const { allow } = require("joi");

module.exports = (sequelize, DataTypes) => {
    const ReviewReply = sequelize.define('ReviewReply', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        review_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        admin_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        reply: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'review_replies',
        timestamps: true
    });
    ReviewReply.associate = (models) => {
        ReviewReply.belongsTo(models.Review, { foreignKey: 'review_id', as: 'review' });
        ReviewReply.belongsTo(models.User, { foreignKey: 'admin_id', as: 'admin' }); // người trả lời là admin
    };
    return ReviewReply;
}