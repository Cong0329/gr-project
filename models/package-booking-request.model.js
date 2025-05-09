module.exports = (sequelize, DataTypes) => {
  const PackageBookingRequest = sequelize.define('PackageBookingRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    package_type: {
      type: DataTypes.ENUM('general', 'medical'),
      allowNull: false
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    requested_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    requested_time_slot: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'doctor_requested', 'assigned', 'rejected', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    tableName: 'package_booking_request',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeUpdate: async (bookingRequest) => {
        if (bookingRequest.changed('schedule_id') && bookingRequest.schedule_id) {
          bookingRequest.status = 'assigned';
        }
      }
    }
  });

  PackageBookingRequest.associate = function(models) {
    PackageBookingRequest.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    PackageBookingRequest.hasMany(models.DoctorAssignment, {
      foreignKey: 'booking_request_id',
      as: 'doctorAssignments'
    });

    PackageBookingRequest.belongsTo(models.ServicePackage, {
      foreignKey: 'package_id',
      as: 'package'
    });

    PackageBookingRequest.belongsTo(models.Schedule, {
      foreignKey: 'schedule_id',
      as: 'schedule'
    });
  };

  PackageBookingRequest.prototype.createSchedule = async function(doctor_id, start_time, end_time) {
    const Schedule = sequelize.models.Schedule;
    
    const schedule = await Schedule.create({
      doctor_id,
      date: this.requested_date,
      start_time,
      end_time,
      status: 'booked',
      type: this.package_type,
      service_id: this.package_id
    });
    
    await this.update({
      schedule_id: schedule.id,
      status: 'assigned'
    });
    
    return schedule;
  };

  return PackageBookingRequest;
};