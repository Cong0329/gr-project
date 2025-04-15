module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define('Department', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING
      },
      price: {
        type: DataTypes.STRING
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
      tableName: 'department',
      timestamps: false
    });

    Department.associate = (models) => {
      Department.hasMany(models.Doctor, {
        foreignKey: 'department_id',
        as: 'doctors'
      });
    };
    
  
    return Department;
  };
  