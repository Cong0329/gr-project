module.exports = (sequelize, DataTypes) => {
  const ServicePackage = sequelize.define('ServicePackage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('general', 'medical'),
      allowNull: false,
      comment: 'Phân loại gói (tổng quát hoặc xét nghiệm)'
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
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    target: {
      type: DataTypes.STRING,
      comment: 'Đối tượng hướng đến của gói dịch vụ'
    },
    image: {
      type: DataTypes.STRING
    },
    details: {
      type: DataTypes.JSON,
      comment: 'Chi tiết bổ sung, khác nhau tùy loại gói'
    },
    availableLocations: {
      type: DataTypes.JSON
    },
    validUntil: {
      type: DataTypes.DATEONLY
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'service_categories',
        key: 'id'
      }
    }
  }, {
    tableName: 'service_packages',
    timestamps: true
  });

  ServicePackage.associate = function(models) {
    ServicePackage.belongsTo(models.ServiceCategory, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    
    // Quan hệ với ServiceItem thông qua bảng trung gian
    ServicePackage.belongsToMany(models.ServiceItem, {
      through: 'package_items',
      foreignKey: 'packageId',
      otherKey: 'itemId',
      as: 'items'
    });
  };

  return ServicePackage;
};