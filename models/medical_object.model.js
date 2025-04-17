
module.exports = (sequelize, DataTypes) => {
    const MedicalObject = sequelize.define('MedicalObject', {
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
        tableName: 'medical_object',
        timestamps: true
    });
    MedicalObject.associate = (models) => {
        MedicalObject.hasMany(models.Product, {
            foreignKey: 'medical_object_id',
            as: 'products',
        });
    };
    return MedicalObject;
};