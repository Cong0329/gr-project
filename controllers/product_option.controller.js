// controllers/productOption.controller.js

const { Product, ProductOption } = require('../models');

exports.addProductOption = async (req, res) => {
  const { product_id, label, price, discounted_price } = req.body;

  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const option = await ProductOption.create({
      product_id,
      label,
      price,
      discounted_price: discounted_price || 0
    });

    return res.status(201).json({ message: 'Option created', option });
  } catch (error) {
    console.error('Error adding option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProductOption = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const option = await ProductOption.findByPk(id);

    if (!option) {
      return res.status(404).json({ message: 'Product option not found' });
    }

    await option.update(updateFields);

    return res.status(200).json({
      message: 'Product option updated successfully',
      option,
    });
  } catch (error) {
    console.error('Error updating product option:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteOption = async (req, res) => {
  const { optionId } = req.params;

  try {
    const option = await ProductOption.findByPk(optionId);
    if (!option) return res.status(404).json({ message: "Option not found" });

    await option.destroy();
    res.status(200).json({ message: "Option deleted successfully" });

  } catch (err) {
    console.error("Delete option error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
