module.exports = (sequelize, DataTypes) => {
    const Indication = sequelize.define('Indication', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'indication',
        timestamps: false
    });
    return Indication;
};