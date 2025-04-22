module.exports = (sequelize, DataTypes) => {
    const PackageItem = sequelize.define('PackageItem', {
      packageId: {
        type: DataTypes.INTEGER,
        
        allowNull: false
      },
      itemId: {
        type: DataTypes.INTEGER,
        
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      }
    }, {
      tableName: 'package_items',
      timestamps: false
    });
      
    return PackageItem;
  };
  