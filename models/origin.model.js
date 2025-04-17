module.exports = (sequelize, DataTypes) => {
    const Origin = sequelize.define('Origin', {
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
        tableName: 'origin',
        timestamps: true
    }
    );
    Origin.associate = (models) => {
        Origin.hasMany(models.Product, {
            foreignKey: 'origin_id',
            as: 'products',
        });
    };
    return Origin;
};