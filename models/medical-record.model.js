
module.exports = (sequelize, DataTypes) => {
    const MedicalRecord = sequelize.define('MedicalRecord', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        doctor_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'doctor',
                key: 'id'
            }
        },
        schedule_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'schedule',
                key: 'id'
            }
        },
        diagnosis: DataTypes.STRING,
        treatment: DataTypes.STRING,
    }, {
        tableName: 'medical_record',
        timestamps: true
    });
    
    MedicalRecord.associate = (models) => {
        MedicalRecord.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'mr_user'
        });

        MedicalRecord.belongsTo(models.Doctor, {
            foreignKey: 'doctor_id',
            as: 'mr_doctor'
        });

        MedicalRecord.belongsTo(models.Schedule, {
            foreignKey: 'schedule_id',
            as: 'mr_schedule'
        });
    };

    return MedicalRecord;
};