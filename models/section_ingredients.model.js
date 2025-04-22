module.exports = (sequelize, DataTypes) => {
    const SectionIngredient = sequelize.define('SectionIngredient', {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      section_id: { type: DataTypes.BIGINT, allowNull: false },
      name: DataTypes.STRING,
      value: DataTypes.STRING
    }, {
      tableName: 'section_ingredients',
      timestamps: false
    });
  
    SectionIngredient.associate = (models) => {
      SectionIngredient.belongsTo(models.ProductDetailSection, { foreignKey: 'section_id', as: 'section' });
    };
  
    return SectionIngredient;
  };
  