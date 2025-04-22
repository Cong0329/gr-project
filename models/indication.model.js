

module.exports = (sequelize, DataTypes) => {
    const Indication = sequelize.define('Indication', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'indication',
        timestamps: true
    });
    Indication.associate = (models) => {
        Indication.hasMany(models.Product, {
            foreignKey: 'indication_id',
            as: 'products',
        });
    };
    return Indication;
};