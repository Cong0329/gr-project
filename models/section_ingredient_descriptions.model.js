module.exports = (sequelize, DataTypes) => {
    const SectionIngredientDescription = sequelize.define('SectionIngredientDescription', {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      section_id: { type: DataTypes.BIGINT, allowNull: false },
      text: DataTypes.TEXT
    }, {
      tableName: 'section_ingredient_descriptions',
      timestamps: false
    });
  
    SectionIngredientDescription.associate = (models) => {
      SectionIngredientDescription.belongsTo(models.ProductDetailSection, { foreignKey: 'section_id', as: 'section' });
    };
  
    return SectionIngredientDescription;
  };
  