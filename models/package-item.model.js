module.exports = (sequelize, DataTypes) => {
    const PackageItem = sequelize.define('PackageItem', {
      packageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'service_packages',
          key: 'id'
        }
      },
      itemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'service_items',
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      }
    }, {
      tableName: 'package_items',
      timestamps: false
    });
  
    return PackageItem;
  };