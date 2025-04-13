module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      type: DataTypes.DATEONLY,  // Thay bằng DATEONLY để lưu ngày tháng chuẩn
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    start_time: {
      type: DataTypes.TIME,  // Thay bằng TIME để lưu giờ phút chuẩn
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,  // Thay bằng TIME để lưu giờ phút chuẩn
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
        isIn: [['available', 'booked', 'cancelled', 'completed']]  // Thêm trạng thái completed
      }
    },
    type: {
      type: DataTypes.ENUM('general', 'medical', 'specialist', 'specialist_online'),  // Thêm specialist_online
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
      validate: {
        async isValidServiceId(value) {
          if (!this.type) return;
          
          let model;
          switch (this.type) {
            case 'general':
              model = sequelize.models.GeneralPackage;
              break;
            case 'medical':
              model = sequelize.models.MedicalPackage;
              break;
            case 'specialist':
            case 'specialist_online':
              model = sequelize.models.Department;
              break;
            default:
              throw new Error('Invalid service type');
          }
          
          const exists = await model.findByPk(value);
          if (!exists) {
            throw new Error(`Service ID not found in ${this.type} table`);
          }
        }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP')  // Thêm tự động cập nhật
    }
  }, {
    tableName: 'schedule',
    timestamps: false,
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
        // Tự động validate service_id khi type thay đổi
        if (schedule.changed('type') && schedule.service_id) {
          await schedule.validate({ fields: ['service_id'] });
        }
      }
    }
  });

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor'
    });
    
    // Không thêm association với Service vì service_id tham chiếu đa bảng
    // Thay vào đó, tạo phương thức helper để lấy service
  };

  // Thêm phương thức helper để lấy service tương ứng
  Schedule.prototype.getService = async function() {
    let model;
    switch (this.type) {
      case 'general':
        model = sequelize.models.GeneralPackage;
        break;
      case 'medical':
        model = sequelize.models.MedicalPackage;
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