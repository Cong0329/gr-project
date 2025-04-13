const { Category } = require('../models');

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
        const categorys = await Category.findAll();
        res.json({ categorys });
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



