const { Brand, Product, ProductImage, ProductOption, ProductDetail, ProductDetailSection, Category, MedicalObject, Indication } = require('../models');
const cloudinary = require('../utils/cloudinary');

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Brand.findAndCountAll({
      attributes: ['id', 'name', 'logo', 'country', 'original'],
      limit,
      offset,
      order: [['id', 'ASC']],
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'slug'],
          limit: 1, // Lấy 1 sản phẩm
          separate: true, // để áp dụng limit chính xác cho từng brand
          include: [
            {
              model: ProductImage,
              as: 'images',
              attributes: ['id', 'image'],
              limit: 1 // Lấy 1 ảnh
            }
          ]
        }
      ]
    });

    res.status(200).json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      brands: rows
    });
  } catch (err) {
    console.error('Get brands error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    const { name, country, original } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Logo is required' });

    // Upload lên Cloudinary
    const result = cloudinary.uploader.upload_stream(
      { folder: 'brands' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: 'Upload error', error });

        const brand = await Brand.create({
          name,
          logo: result.secure_url, // lưu URL vào DB
          country,
          original
        });

        res.status(201).json({ message: 'Brand created', brand });
      }
    );

    result.end(req.file.buffer); // đẩy file từ bộ nhớ RAM vào stream
  } catch (err) {
    console.error('Create brand error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a brand
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const updateData = {};

    // Nếu có tên mới
    if (req.body.name !== undefined) {
      updateData.name = req.body.name;
    }
    if (req.body.country !== undefined) {
      updateData.country = req.body.country;
    }
    if (req.body.original !== undefined) {
      updateData.original = req.body.original;
    }
    // Nếu có file ảnh mới
    if (file) {
      const result = cloudinary.uploader.upload_stream(
        { folder: 'brands' },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            return res.status(500).json({ message: 'Failed to upload image' });
          }

          updateData.logo = result.secure_url;
          await brand.update(updateData);
          res.json({ message: 'Brand updated', brand });
        }
      );

      // Đẩy buffer của file vào stream
      result.end(file.buffer);
    } else {
      // Nếu không có file, chỉ update những gì có
      await brand.update(updateData);
      res.json({ message: 'Brand updated', brand });
    }
  } catch (err) {
    console.error('Update brand error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete a brand
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    const publicId = brand.logo.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`brands/${publicId}`);

    await brand.destroy();
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    console.error('Delete brand error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getProductsByBrandName = async (req, res) => {
  const { name } = req.params;

  try {
    const brand = await Brand.findOne({
      where: { name: name },
      include: [
        {
          model: Product,
          as: 'products',
          where: { is_deleted: false }, // 💥 Chỉ lấy sản phẩm chưa bị ẩn
          attributes: ['id', 'name', 'quantity', 'slug', 'specification', 'type'],
          include: [
            {
              model: Brand,
              as: 'brand',
              attributes: ['id', 'name', 'country', 'original'],
            },
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


    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    res.status(200).json({
      products: brand.products
    });
  } catch (error) {
    console.error('Error fetching products by brand name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProductsByBrandCountry = async (req, res) => {
  const { country } = req.params;

  try {
    const brand = await Brand.findOne({
      where: { country },
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'slug', 'code', 'rating']
        }
      ]
    });

    if (!brand) return res.status(404).json({ message: 'Brand not found with this country' });

    res.status(200).json({
      products: brand.products
    });
  } catch (error) {
    console.error('Error fetching products by brand country:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/products/by-original/:original
exports.getProductsByBrandOriginal = async (req, res) => {
  const { original } = req.params;

  try {
    const brand = await Brand.findOne({
      where: { original },
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'slug', 'code', 'rating']
        }
      ]
    });

    if (!brand) return res.status(404).json({ message: 'Brand not found with this origin' });

    res.status(200).json({
      products: brand.products
    });
  } catch (error) {
    console.error('Error fetching products by brand original:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
