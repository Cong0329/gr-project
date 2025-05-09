
module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('Brand', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        original: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'brand',
        timestamps: false
    }
    );
    Brand.associate = (models) => {
        Brand.hasMany(models.Product, {
            foreignKey: 'brand_id',
            as: 'products',
        });
    };

    return Brand;
};