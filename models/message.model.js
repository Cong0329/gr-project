
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_hidden_from_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // migration hoặc model bổ sung
    locked_by: {
      type: DataTypes.UUID, // hoặc kiểu ID bạn dùng cho admin
      allowNull: true,
    },
    update_at : {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    tableName: 'messages',
    timestamps: true,
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: 'user_id' });
    Message.hasMany(models.MessageItem, { foreignKey: 'message_id', as: 'items' });
  };

  return Message;
};
