module.exports = (sequelize, DataTypes) => {
  const DoctorAssignment = sequelize.define('DoctorAssignment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booking_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('doctor_requested', 'approved', 'rejected_by_admin'),
      defaultValue: 'doctor_requested',
      allowNull: false
    },
    doctor_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    admin_note: {
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
    tableName: 'doctor_assignment', 
    timestamps: false
  });

  DoctorAssignment.associate = function(models) {
    DoctorAssignment.belongsTo(models.PackageBookingRequest, {
      foreignKey: 'booking_request_id',
      as: 'bookingRequest'
    });

    DoctorAssignment.belongsTo(models.User, {
      foreignKey: 'doctor_id',
      as: 'doctor'
    });
  };

  return DoctorAssignment;
};
