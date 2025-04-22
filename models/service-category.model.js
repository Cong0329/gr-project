module.exports = (sequelize, DataTypes) => {
  const ServiceCategory = sequelize.define('ServiceCategory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'service_categories',
        key: 'id'
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tên danh mục dịch vụ'
    }
  }, {
    tableName: 'service_categories',
    timestamps: false
  });

  ServiceCategory.associate = function(models) {
    ServiceCategory.hasMany(models.ServiceCategory, {
      foreignKey: 'parentId',
      as: 'subCategories'
    });
    
    ServiceCategory.belongsTo(models.ServiceCategory, {
      foreignKey: 'parentId',
      as: 'parentCategory'
    });
    
    ServiceCategory.hasMany(models.ServicePackage, {
      foreignKey: 'categoryId',
      as: 'servicePackages'
    });
    
    ServiceCategory.hasMany(models.ServiceItem, {
      foreignKey: 'categoryId',
      as: 'serviceItems'
    });
  };

  return ServiceCategory;
};