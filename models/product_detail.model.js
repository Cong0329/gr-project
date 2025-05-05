const { on } = require("nodemailer/lib/xoauth2");

module.exports = (sequelize, DataTypes) => {
    const ProductDetail = sequelize.define('ProductDetail', {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      product_id: { type: DataTypes.UUID, allowNull: false },
      title: DataTypes.STRING,
    }, {
      tableName: 'product_details',
      timestamps: false
    });
  
    ProductDetail.associate = (models) => {
      ProductDetail.hasMany(models.ProductDetailSection, { foreignKey: 'product_detail_id', as: 'sections', onDelete: 'CASCADE' });
      ProductDetail.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product', onDelete: 'CASCADE' });
    };
  
    return ProductDetail;
  };
  