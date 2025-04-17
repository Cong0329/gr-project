// models/Cart.js
module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true, // mỗi user chỉ có 1 cart
      },
    }, {
      tableName: 'cart',
      timestamps: true,
    });
  
    Cart.associate = (models) => {
      Cart.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
  
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cart_id',
        as: 'items',
        onDelete: 'CASCADE',
      });
    };
  
    return Cart;
  };
  