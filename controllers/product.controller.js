const { Product } = require('../models');
const { productExcludeAttributes, productIncludeOptions } = require('../utils/productInclude');
const  pickProductFields  = require('../utils/productFileds');

// Creat Product
exports.createProduct = async (req, res) => {
  try {
    const productData = pickProductFields(req.body);

    const product = await Product.create(productData);

    res.status(201).json({
      message: 'Product created successfully!',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

// Get product by slug
exports.getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({
      where: { slug },
      include: productIncludeOptions,
      attributes: productExcludeAttributes
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Kiểm tra nếu không có ảnh hoặc option
    if (!product.images || product.images.length === 0) {
      return res.status(400).json({ message: 'Product must have at least one image' });
    }

    if (!product.options || product.options.length === 0) {
      return res.status(400).json({ message: 'Product must have at least one option' });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
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
          attributes: [], // Không trả về data
          required: true,
          include: [
            {
              model: ProductDetailSection,
              as: 'sections',
              attributes: [], // Không trả về sections
              required: true, // Bắt buộc phải có ít nhất 1 section
            },
          ],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};






// update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Chỉ cập nhật những trường được gửi lên
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        product[key] = updates[key];
      }
    });

    await product.save();

    res.status(200).json({
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};