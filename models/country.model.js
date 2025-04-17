


module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define('Country', {
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
        code: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'country',
        timestamps: true
    });
    Country.associate = (models) => {
        Country.hasMany(models.Product, {
            foreignKey: 'country_id',
            as: 'products',
        });
    };

    return Country;
};