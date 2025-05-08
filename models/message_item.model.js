// models/MessageItem.js
module.exports = (sequelize, DataTypes) => {
    const MessageItem = sequelize.define('MessageItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        message_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sender_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'message_items',
        timestamps: true
    });

    MessageItem.associate = (models) => {
        MessageItem.belongsTo(models.Message, { foreignKey: 'message_id' });
        MessageItem.belongsTo(models.User, { foreignKey: 'sender_id' });
    };

    return MessageItem;
};
