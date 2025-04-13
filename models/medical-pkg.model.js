module.exports = (sequelize, DataTypes) => {
    const MedicalPkg = sequelize.define('medical_pkg', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      image: {
        type: DataTypes.STRING
      },
      servicePkg_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'medical_pkg',
      timestamps: false
    });
  
    return MedicalPkg;
  };
  