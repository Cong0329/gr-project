// models/CartItem.js
module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        cart_id: {
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
            validate: {
                min: 1,
            },
        }
    }, {
        tableName: 'cart_items',
        timestamps: true,
    });

    CartItem.associate = (models) => {
        CartItem.belongsTo(models.Cart, {
            foreignKey: 'cart_id',
            as: 'cart',
        });

        CartItem.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product',
        });

        CartItem.belongsTo(models.ProductOption, {
            foreignKey: 'option_id',
            targetKey: 'id', // vì option_id là string trong ProductOption
            as: 'option',
        });
    };

    return CartItem;
};
