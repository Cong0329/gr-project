module.exports = (sequelize, DataTypes) => {
    const OrderStatusHistory = sequelize.define('OrderStatusHistory', {
      order_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled'),
        allowNull: false,
      },
      changed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'order_status_histories',
      timestamps: false,
    });
    OrderStatusHistory.associate = (models) => {
        OrderStatusHistory.belongsTo(models.Order, { foreignKey: 'order_id' });
    }
    return OrderStatusHistory;
  };
  