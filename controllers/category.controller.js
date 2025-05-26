const { Category, Product, ProductImage, ProductOption, ProductDetail, ProductDetailSection, Brand, MedicalObject, Indication } = require('../models');
const { Op } = require('sequelize');

exports.createCategory = async (req, res) => {
    try {
        const { name, parent_id } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        // Nếu có parent_id thì kiểm tra xem nó có tồn tại không
        if (parent_id) {
            const parentCategory = await Category.findByPk(parent_id);
            if (!parentCategory) {
                return res.status(400).json({ message: 'Parent category not found' });
            }
        }

        const category = await Category.create({ name, parent_id: parent_id || null });
        res.status(201).json({ message: 'Category created', category });
    } catch (err) {
        console.error('Create Category error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllCategorys = async (req, res) => {
    try {
        const categories = await Category.findAll(
            {
                include: [
                    {
                        model: Category,
                        as: 'parent',
                        attributes: ['id', 'name'] // chỉ lấy thông tin cần thiết
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'parent_id'],
                }
            }
        );
        res.json({ categories });
    } catch (err) {
        console.error('Get Categorys error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getParentCategorys = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { parent_id: null }
        });
        res.json({ categories });
    } catch (err) {
        console.error('Get Categorys error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, parent_id } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Kiểm tra name
        if (name !== undefined) category.name = name;

        // Kiểm tra parent_id (có thể là null)
        if (parent_id !== undefined) {
            if (parseInt(parent_id) === parseInt(id)) {
                return res.status(400).json({ message: 'A category cannot be its own parent' });
            }

            if (parent_id !== null) {
                const parentCategory = await Category.findByPk(parent_id);
                if (!parentCategory) {
                    return res.status(400).json({ message: 'Parent category not found' });
                }
            }

            category.parent_id = parent_id;
        }

        await category.save();

        res.json({ message: 'Category updated', category });
    } catch (err) {
        console.error('Update Category error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllCategoryIds = async (parentId) => {
    const result = [parentId];
    const children = await Category.findAll({ where: { parent_id: parentId }, attributes: ['id'] });

    for (const child of children) {
        const childIds = await getAllCategoryIds(child.id);
        result.push(...childIds);
    }

    return result;
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
        const category = await Category.findOne({ where: { name } });
        if (!category) return res.status(404).json({ message: 'Category not found' });

        // ✅ Lấy toàn bộ ID category bao gồm con nhiều cấp
        const categoryIds = await getAllCategoryIds(category.id);

        const products = await Product.findAll({
            where: {
                category_id: { [Op.in]: categoryIds },
                is_deleted: false
            },
            attributes: ['id', 'name', 'quantity', 'slug', 'specification', 'type'],
            include: [
                { model: Brand, as: 'brand', attributes: ['id', 'name'] },
                { model: Category, as: 'category', attributes: ['id', 'name'] },
                { model: MedicalObject, as: 'medical_object', attributes: ['id', 'name'] },
                { model: Indication, as: 'indication', attributes: ['id', 'name'] },
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['id', 'image'],
                    required: true,
                    limit: 1
                },
                {
                    model: ProductOption,
                    as: 'options',
                    attributes: ['id', 'label', 'price', 'discounted_price'],
                    required: true
                },
                {
                    model: ProductDetail,
                    as: 'detail',
                    attributes: [],
                    required: true,
                    include: [{
                        model: ProductDetailSection,
                        as: 'sections',
                        attributes: [],
                        required: true
                    }]
                }
            ]
        });

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products by category name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCategoryTreeWithProducts = async (req, res) => {
    const { name } = req.params;

    try {
        // Tìm danh mục cha theo tên
        const parentCategory = await Category.findOne({ where: { name } });
        if (!parentCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Lấy danh mục con cấp 1
        const level1Categories = await Category.findAll({
            where: { parent_id: parentCategory.id },
            attributes: ['id', 'name']
        });

        // Lấy danh mục con cấp 2 của từng cấp 1
        const categoryData = await Promise.all(
            level1Categories.map(async (cat1) => {
                const children = await Category.findAll({
                    where: { parent_id: cat1.id },
                    attributes: ['id', 'name']
                });

                // Lấy sản phẩm thuộc danh mục cấp 1 và cấp 2
                const childIds = children.map(c => c.id);
                const categoryIds = [cat1.id, ...childIds];

                const products = await Product.findAll({
                    where: {
                        category_id: { [Op.in]: categoryIds },
                        is_deleted: false
                    },
                    limit: 5,
                    attributes: ['id', 'name', 'slug'],
                    include: [{
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image'],
                        limit: 1,
                        required: true
                    }
                    , {
                        model: ProductOption,
                        as: 'options',
                        attributes: ['id', 'label', 'price', 'discounted_price'],
                        required: true,
                        limit: 1
                    }]
                });

                // Format dữ liệu sản phẩm
                const formattedProducts = products.map(p => ({
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    image: p.images[0]?.image || null,
                    price: p.options?.[0]?.price || 0,  // nếu cần thêm option giá
                    label: p.options?.[0]?.label || null,
                    discounted_price: p.options?.[0]?.discounted_price || 0,
                }));

                return {
                    id: cat1.id,
                    name: cat1.name,
                    children,
                    products: formattedProducts
                };
            })
        );

        res.json({
            id: parentCategory.id,
            name: parentCategory.name,
            categories: categoryData
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



