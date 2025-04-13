module.exports = (sequelize, DataTypes) => {
    const MedicalObject = sequelize.define('MedicalObject', {
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
        tableName: 'medical_object',
        timestamps: false
    });

    return MedicalObject;
};