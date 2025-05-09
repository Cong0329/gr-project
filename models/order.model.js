// models/Order.js
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending","confirmed", "shipping", "completed", "cancelled", "unpaid"),
        defaultValue: "pending",
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discout_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_address_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      payment_method_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
        "tableName": "order",
        "timestamps": true,
    }
);
  
    Order.associate = (models) => {
      Order.belongsTo(models.User, { foreignKey: "user_id" , as: "user"} );
      Order.belongsTo(models.Address, { foreignKey: "shipping_address_id", as: "shipping_address" });
      Order.belongsTo(models.PaymentMethod, { foreignKey: 'payment_method_id', as: 'payment_method' });
      Order.hasMany(models.OrderItem, { foreignKey: "order_id", as: "items" });
      Order.hasMany(models.OrderStatusHistory, { foreignKey: 'order_id', as: 'status_history' });
    };
  
    return Order;
  };
  