const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0
    },
    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    comment_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dosage_form: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specification: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    registration_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    origin_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    medical_object_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    indication_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'product',
    timestamps: true
  });
  Product.beforeCreate((product) => {
    product.slug = slugify(product.name, { lower: true, strict: true });
  });

  Product.beforeUpdate((product) => {
    if (product.changed('name')) {
      product.slug = slugify(product.name, { lower: true, strict: true });
    }
  });


  
  Product.associate = (models) => {
    Product.belongsTo(models.Brand, {
      foreignKey: 'brand_id',
      as: 'brand'
    });
    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
    Product.belongsTo(models.Origin, {
      foreignKey: 'origin_id',
      as: 'origin'
    });
    Product.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
    Product.belongsTo(models.MedicalObject, {
      foreignKey: 'medical_object_id',
      as: 'medical_object'
    });
    Product.belongsTo(models.Indication, {
      foreignKey: 'indication_id',
      as: 'indication'
    });
    Product.hasMany(models.ProductImage, {
      foreignKey: 'product_id',
      as: 'images'
    });
    Product.hasMany(models.ProductOption, {
      foreignKey: 'product_id',
      as: 'options'
    });
  };

  return Product;
};
