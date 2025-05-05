// controllers/productOption.controller.js

const { Product, ProductOption } = require('../models');

exports.addProductOption = async (req, res) => {
  const { product_id, options } = req.body;

  try {
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Nếu gửi 1 option (không phải mảng)
    const optionList = Array.isArray(options) ? options : [options];

    const createdOptions = await Promise.all(
      optionList.map(async (opt) => {
        const { label, price, discounted_price } = opt;
        return await ProductOption.create({
          product_id,
          label,
          price,
          discounted_price: discounted_price || 0,
        });
      })
    );

    return res.status(201).json({ message: 'Options created', options: createdOptions });
  } catch (error) {
    console.error('Error adding options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getOptionsByProductId = async (req, res) => {
  const { product_id } = req.params;

  try {
    const options = await ProductOption.findAll({
      where: { product_id },
      attributes: ['id', 'label', 'price', 'discounted_price']
    });

    if (!options.length) {
      return res.status(404).json({ message: 'No options found for this product' });
    }

    res.status(200).json(options);
  } catch (error) {
    console.error('Get options error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.updateProductOption = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  console.log(updateFields);
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
  console.log(optionId);
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
