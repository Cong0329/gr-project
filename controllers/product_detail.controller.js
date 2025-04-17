const { ProductDetail, ProductDetailSection, SectionIngredient, SectionIngredientDescription } = require("../models"); // Import model ProductDetail
exports.createProductDetail = async (req, res) => {
    try {
        const { product_id, title } = req.body;
        const detail = await ProductDetail.create({ product_id, title });
        res.status(201).json(detail);
    } catch (err) {
        res.status(500).json({ message: "Create failed", error: err.message });
    }
};

exports.getProductDetailByProductId = async (req, res) => {
    const { product_id } = req.params;
    try {
        const detail = await ProductDetail.findOne({
            where: { product_id },
            include: [
                {
                    model: ProductDetailSection,
                    as: 'sections',
                    include: [
                        {
                            model: SectionIngredientDescription,
                            as: 'descriptions'
                        },
                        {
                            model: SectionIngredient,
                            as: 'ingredients'
                        }
                    ]
                }
            ]
        });

        if (!detail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }

        res.status(200).json(detail);
    } catch (err) {
        console.error('Get product detail error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// update
exports.updateProductDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const detail = await ProductDetail.findByPk(id);

        if (!detail) return res.status(404).json({ message: "Detail not found" });

        const { title } = req.body;

        if (title !== undefined) detail.title = title;

        await detail.save();

        res.status(200).json({ message: "Updated successfully", data: detail });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};

// Delete
exports.deleteProductDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const detail = await ProductDetail.findByPk(id);

        if (!detail) return res.status(404).json({ message: "Detail not found" });

        await detail.destroy();

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};