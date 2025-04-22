module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define(
        "ProductImage",
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
            image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "product_image",
            timestamps: true,
        }
    );
    ProductImage.associate = function (models) {
        ProductImage.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product",
            onDelete: "CASCADE",
        });
    };
   

    return ProductImage;
};