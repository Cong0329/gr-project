module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define("OrderItem", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      option_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Giá tại thời điểm mua
      },
    },
  {
    "tableName": "order_item",
    "timestamps": true
  });
  
    OrderItem.associate = (models) => {
      OrderItem.belongsTo(models.Order, { foreignKey: "order_id" });
      OrderItem.belongsTo(models.Product, { foreignKey: "product_id" });
      OrderItem.belongsTo(models.ProductOption, { foreignKey: "option_id", as: "option" });
    };
  
    return OrderItem;
  };
  