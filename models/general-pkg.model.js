module.exports = (sequelize, DataTypes) => {
    const GeneralPkg = sequelize.define('general_pkg', {
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
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalDuration: {
        type: DataTypes.INTEGER
      },
      durationUnit: {
        type: DataTypes.STRING,
        defaultValue: 'phút'
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      reviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      target: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.STRING
      },
      availableLocations: {
        type: DataTypes.JSON 
      },
      validUntil: {
        type: DataTypes.DATEONLY 
      },
      servicePkg_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'general_pkg',
      timestamps: false
    });
  
    return GeneralPkg;
  };
  