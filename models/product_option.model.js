module.exports = (sequelize, DataTypes) => {
    const ProductOption = sequelize.define(
        "ProductOption",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            product_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            label: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false,
            },
            discounted_price: {
                type: DataTypes.DECIMAL(10,2),
                defaultValue: 0
            },
        },
        {
            tableName: "product_option",
            timestamps: true,
        }
    )
    ProductOption.associate = function (models) {
        ProductOption.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product",
            onDelete: "CASCADE",
        });
    }
    return ProductOption;
}