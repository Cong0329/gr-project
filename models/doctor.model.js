module.exports = (sequelize, DataTypes) => {
    const Doctor = sequelize.define('Doctor', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar: DataTypes.STRING,
      type: DataTypes.STRING,
      experience: DataTypes.STRING,
      position: DataTypes.STRING,
      patientAge: DataTypes.STRING,
      location: DataTypes.STRING,
      clinic: DataTypes.STRING,
      address: DataTypes.STRING,
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },      
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: DataTypes.DATE,
      created_by: DataTypes.BIGINT,
      updated_by: DataTypes.BIGINT,
      deleted_by: DataTypes.BIGINT
    }, {
      tableName: 'doctor',
      timestamps: true
    });
  
    return Doctor;
  };
  