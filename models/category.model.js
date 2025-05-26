module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'category',
                key: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    }, {
        tableName: 'category',
        timestamps: true
    });

    Category.associate = (models) => {
        // Mối quan hệ với Product
        Category.hasMany(models.Product, {
            foreignKey: 'category_id',
            as: 'products',
        });

        // Mối quan hệ category cha - con
        Category.hasMany(models.Category, {
            foreignKey: 'parent_id',
            as: 'children'
        });

        Category.belongsTo(models.Category, {
            foreignKey: 'parent_id',
            as: 'parent'
        });
    };

    return Category;
};
