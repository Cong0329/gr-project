module.exports = (sequelize, DataTypes) => {
    const ProductDetailSection = sequelize.define('ProductDetailSection', {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      product_detail_id: { type: DataTypes.BIGINT, allowNull: false },
      type: DataTypes.ENUM('Product Description', 'Ingredients', 'Benefits', 'Usage', 'Side Effects', 'Warnings', 'Storage'),
      title: DataTypes.STRING,
      image: DataTypes.TEXT,
      description: DataTypes.TEXT
    }, {
      tableName: 'product_detail_sections',
      timestamps: false
    });
  
    ProductDetailSection.associate = (models) => {
      ProductDetailSection.belongsTo(models.ProductDetail, { foreignKey: 'product_detail_id', as: 'product_detail' });
      ProductDetailSection.hasMany(models.SectionIngredientDescription, { foreignKey: 'section_id', as: 'descriptions', onDelete: 'CASCADE' });
      ProductDetailSection.hasMany(models.SectionIngredient, { foreignKey: 'section_id', as: 'ingredients', onDelete: 'CASCADE' });
    };
  
    return ProductDetailSection;
  };
  