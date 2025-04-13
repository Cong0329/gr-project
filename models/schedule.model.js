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
      type: DataTypes.STRING,
      allowNull: false
    },
    start_time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    end_time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'available',
      validate: {
        isIn: [['available', 'booked', 'cancelled']]
      }
    },
    type: {
      type: DataTypes.ENUM('general', 'medical', 'specialist'),
      allowNull: false
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'schedule',
    timestamps: false
  });

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor'
    });
    
    Schedule.belongsTo(models.Service, {
      foreignKey: 'service_id',
      as: 'service'
    });
  };

  return Schedule;
};