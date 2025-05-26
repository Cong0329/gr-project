module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    doctor_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME, 
      allowNull: false,
      validate: {
        isAfterStartTime(value) {
          if (this.start_time && value <= this.start_time) {
            throw new Error('End time must be after start time');
          }
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'available',
      validate: {
        isIn: [['available', 'booked', 'cancelled', 'completed']] 
      }
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
      allowNull: false,
    },
    
  }, {
    tableName: 'schedule',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['doctor_id']
      },
      {
        fields: ['date']
      },
      {
        fields: ['type', 'service_id']
      },
      {
        fields: ['status']
      }
    ],
    hooks: {
      beforeValidate: async (schedule) => {
        if (schedule.changed('type') && schedule.service_id && !schedule._validatingServiceId) {
          schedule._validatingServiceId = true;
          await schedule.validate({ fields: ['service_id'] });
          schedule._validatingServiceId = false;
        }
      }
    }
  });

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor'
    });
    
    Schedule.belongsTo(models.ServicePackage, {
      foreignKey: 'service_id',
      constraints: false,
      as: 'servicePackage',
      scope: {
        type: {
          $in: ['general', 'medical']
        }
      }
    });
    
    Schedule.belongsTo(models.Department, {
      foreignKey: 'service_id',
      constraints: false,
      as: 'department',
      scope: {
        type: {
          $in: ['specialist', 'specialist_online']
        }
      }
    });
    
    Schedule.hasOne(models.PackageBookingRequest, {
      foreignKey: 'schedule_id',
      as: 'bookingRequest'
    });
  };

  Schedule.prototype.getService = async function() {
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

  return Schedule;
};