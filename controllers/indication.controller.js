const { Indication, Product, ProductImage, ProductOption, ProductDetail, ProductDetailSection, Brand } = require('../models');

exports.createIndication = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const indication = await Indication.create({ name });
        res.status(201).json({ message: 'indication created', indication });
    } catch (err) {
        console.error('Create indication error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllIndications = async (req, res) => {
    try {
        const indications = await Indication.findAll();
        res.json({ indications });
    } catch (err) {
        console.error('Get indications error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateIndication = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const indication = await Indication.findByPk(id);
        if (!indication) {
            return res.status(404).json({ message: 'indication not found' });
        }

        if (name !== undefined) indication.name = name;
        await indication.save();

        res.json({ message: 'indication updated', indication });
    } catch (err) {
        console.error('Update indication error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.deleteIndication = async (req, res) => {
    try {
        const { id } = req.params;

        const indication = await Indication.findByPk(id);
        if (!indication) {
            return res.status(404).json({ message: 'indication not found' });
        }

        await indication.destroy();
        res.json({ message: 'indication deleted' });
    } catch (err) {
        console.error('Delete indication error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getProductsByIndicationName = async (req, res) => {
    const { name } = req.params;

    try {
        const indication = await Indication.findOne({
            where: { name: name },
            include: [
                {
                    model: Product,
                    as: 'products',
                    where: { is_deleted: false }, // 💥 Chỉ lấy sản phẩm chưa bị ẩn
                    attributes: ['id', 'name', 'quantity'],
                    include: [
                        {
                            model: Brand,
                            as: 'brand',
                            attributes: ['id', 'name'],
                        },
                        {
                            model: ProductImage,
                            as: 'images',
                            attributes: ['id', 'image'],
                            required: true, // Phải có ảnh
                        },
                        {
                            model: ProductOption,
                            as: 'options',
                            attributes: ['id', 'label', 'price', 'discounted_price'],
                            required: true, // Phải có option
                        },
                        {
                            model: ProductDetail,
                            as: 'detail',
                            attributes: [],
                            required: true,
                            include: [
                                {
                                    model: ProductDetailSection,
                                    as: 'sections',
                                    attributes: [],
                                    required: true, // Phải có section
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!indication) return res.status(404).json({ message: 'Indication not found' });

        res.status(200).json({
            products: indication.products
        });
    } catch (error) {
        console.error('Error fetching products by Indication name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
