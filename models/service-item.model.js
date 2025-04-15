module.exports = (sequelize, DataTypes) => {
  const ServiceItem = sequelize.define('ServiceItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'service_categories',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    duration: {
      type: DataTypes.INTEGER,
      comment: 'Thời gian thực hiện tính bằng phút'
    },
    price: {
      type: DataTypes.INTEGER,
      comment: 'Giá cho dịch vụ đơn lẻ'
    }
  }, {
    tableName: 'service_items',
    timestamps: false
  });

  ServiceItem.associate = function(models) {
    ServiceItem.belongsTo(models.ServiceCategory, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    
    // Quan hệ với ServicePackage thông qua bảng trung gian
    ServiceItem.belongsToMany(models.ServicePackage, {
      through: 'package_items',
      foreignKey: 'itemId',
      otherKey: 'packageId', 
      as: 'packages'
    });
  };

  return ServiceItem;
};