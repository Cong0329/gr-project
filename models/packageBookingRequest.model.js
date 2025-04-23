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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
    },
  }, {
    tableName: 'package_booking_request',
    timestamps: false,
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

  return PackageBookingRequest;
};
