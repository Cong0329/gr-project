module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schedule',
        key: 'id'
      }
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('general', 'medical', 'specialist', 'specialist_online'),
      allowNull: false,
      validate: {
        isValidType(value) {
          if (!['general', 'medical', 'specialist', 'specialist_online'].includes(value)) {
            throw new Error('Invalid service type');
          }
        }
      }
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending_payment', 'confirmed', 'cancelled', 'completed', 'rejected'),
      defaultValue: 'pending_payment'
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'refunded', 'failed'),
      defaultValue: 'pending'
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    patient_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'appointment',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['doctor_id'] },
      { fields: ['schedule_id'] },
      { fields: ['date'] },
      { fields: ['status'] },
      { fields: ['payment_status'] },
      { fields: ['type', 'service_id'] }
    ]
  });

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    Appointment.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor'
    });

    Appointment.belongsTo(models.Schedule, {
      foreignKey: 'schedule_id',
      as: 'schedule'
    });
  };

  Appointment.prototype.getService = async function () {
    let model;
    switch (this.type) {
      case 'general':
      case 'medical':
        model = sequelize.models.ServicePackage;
        break;
      case 'specialist':
      case 'specialist_online':
        model = sequelize.models.Department;
        break;
      default:
        throw new Error('Invalid service type');
    }

    return model.findByPk(this.service_id);
  };

  return Appointment;
};
