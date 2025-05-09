const { Category, Product } = require('../models');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const category = await Category.create({ name });
        res.status(201).json({ message: 'Category created', category });
    } catch (err) {
        console.error('Create Category error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllCategorys = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({ categories });
    } catch (err) {
        console.error('Get Categorys error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (name !== undefined) category.name = name;
        await category.save();

        res.json({ message: 'Category updated', category });
    } catch (err) {
        console.error('Update Category error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (err) {
        console.error('Delete Category error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getProductsByCategoryName = async (req, res) => {
    const { name } = req.params;

    try {
        const category = await Category.findOne({
            where: { name: name },
            include: [
                {
                    model: Product,
                    as: 'products',
                    attributes: ['id', 'name', 'slug', 'code', 'rating']
                }
            ]
        });

        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({
            products: category.products
        });
    } catch (error) {
        console.error('Error fetching products by category name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

