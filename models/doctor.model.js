module.exports = (sequelize, DataTypes) => {
    const Doctor = sequelize.define('Doctor', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar: DataTypes.STRING,
      type: {
        type: DataTypes.ENUM('specialty', 'online'),
        allowNull: false,
        validate: {
          isIn: [['specialty', 'online']]
        }
      },
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
      deleted_at: DataTypes.DATE,
      created_by: DataTypes.BIGINT,
      updated_by: DataTypes.BIGINT,
      deleted_by: DataTypes.BIGINT
    }, {
      tableName: 'doctor',
      timestamps: true
    });
    Doctor.associate = (models) => {
      Doctor.belongsTo(models.Department, {
        foreignKey: 'department_id',
        as: 'department'
      });
    
      Doctor.hasMany(models.Schedule, {
        foreignKey: 'doctor_id',
        as: 'schedules' 
      });

      Doctor.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'userAccount',
      allowNull: true
    });
    };

    Doctor.prototype.hasAccount = async function() {
    const account = await this.getUserAccount();
    return account !== null;
  };

  Doctor.prototype.getFullInfo = async function() {
    return await Doctor.findByPk(this.id, {
      include: [
        {
          model: sequelize.models.User,
          as: 'userAccount',
          attributes: ['id', 'name', 'email', 'phone', 'avatar_url']
        },
        {
          model: sequelize.models.Department,
          as: 'department',
          attributes: ['id', 'name']
        }
      ]
    });
  };
    
    return Doctor;
  };
  