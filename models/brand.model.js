module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('Brand', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'brand',
        timestamps: false
    }
);

    return Brand;
};