const { Product, ProductImage, ProductOption, ProductDetail, ProductDetailSection, Brand, Category, MedicalObject, Indication } = require('../models');
const { productExcludeAttributes, productIncludeOptions } = require('../utils/productInclude');
const pickProductFields = require('../utils/productFileds');
const { Op } = require('sequelize');

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
      where: { slug, is_deleted: false },
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

// Get product by id
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      where: { is_deleted: false },
      include: productIncludeOptions,
      attributes: productExcludeAttributes
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name'],
        },
        {
          model: MedicalObject,
          as: 'medical_object',
          attributes: ['id', 'name'],
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'image'],
          required: true, // Phải có ảnh
          limit: 1
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
      attributes: ['id', 'name', 'quantity', 'slug', 'specification'],
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

    // Cập nhật is_deleted thành true thay vì xóa
    await product.update({ is_deleted: true });

    return res.status(200).json({ message: "Product hidden successfully" });
  } catch (error) {
    console.error("Hide product error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// search
exports.searchProductsByName = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm "name"' });
    }

    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        },
        is_deleted: false
      },
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name', 'country', 'original'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: MedicalObject, as: 'medical_object', attributes: ['id', 'name'] },
        { model: Indication, as: 'indication', attributes: ['id', 'name'] },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'image'],
          required: true, // Phải có ảnh
          limit: 1
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
      attributes: ['id', 'name', 'quantity', 'slug', 'specification', 'type'],
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error('Lỗi tìm kiếm sản phẩm:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi server' });
  }
};

