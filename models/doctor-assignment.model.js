module.exports = (sequelize, DataTypes) => {
  const DoctorAssignment = sequelize.define('DoctorAssignment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booking_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'package_booking_request',
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
    status: {
      type: DataTypes.ENUM('requested', 'approved', 'rejected'),
      defaultValue: 'requested',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    tableName: 'doctor_assignments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      afterCreate: async (assignment) => {
        if (assignment.status === 'requested') {
          const BookingRequest = sequelize.models.PackageBookingRequest;
          await BookingRequest.update(
            { status: 'doctor_requested' },
            { where: { id: assignment.booking_request_id } }
          );
        }
      },
      afterUpdate: async (assignment) => {
        if (assignment.changed('status') && assignment.status === 'approved') {
          const BookingRequest = sequelize.models.PackageBookingRequest;
          const Doctor = sequelize.models.Doctor;
          
          const bookingRequest = await BookingRequest.findByPk(assignment.booking_request_id);
          const doctor = await Doctor.findByPk(assignment.doctor_id);
          
          if (bookingRequest && doctor && !bookingRequest.schedule_id) {
            // Ở đây có thể tự động tạo schedule hoặc chờ bước tiếp theo
          }
        }
      }
    }
  });

  DoctorAssignment.associate = function(models) {
    DoctorAssignment.belongsTo(models.PackageBookingRequest, {
      foreignKey: 'booking_request_id',
      as: 'bookingRequest'
    });

    DoctorAssignment.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor'
    });
  };

  return DoctorAssignment;
};