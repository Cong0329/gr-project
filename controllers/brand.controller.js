const { Brand, Product } = require('../models');
const cloudinary = require('../utils/cloudinary');

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll(
      {
        attributes: ['id', 'name', 'logo'],
      }
    );
    res.json({ brands });
  } catch (err) {
    console.error('Get brands error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Logo is required' });

    // Upload lên Cloudinary
    const result = cloudinary.uploader.upload_stream(
      { folder: 'brands' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: 'Upload error', error });

        const brand = await Brand.create({
          name,
          logo: result.secure_url, // lưu URL vào DB
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
          attributes: ['id', 'name', 'slug', 'code', 'rating']
        }
      ]
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