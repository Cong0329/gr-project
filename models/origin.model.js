module.exports = (sequelize, DataTypes) => {
    const Origin = sequelize.define('Origin', {
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
        tableName: 'origin',
        timestamps: false
    }
    );

    return Origin;
};