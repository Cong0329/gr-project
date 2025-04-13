

module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define('Country', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'country',
        timestamps: false
    });

    return Country;
};