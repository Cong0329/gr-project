const { Product, ProductImage } = require('../models');
const cloudinary = require('../utils/cloudinary'); // Đảm bảo bạn đã cấu hình Cloudinary
const streamifier = require('streamifier');


exports.addProductImages = async (req, res) => {
    const { productId } = req.body;
    const files = req.files; // Multer sẽ trả về mảng files

    try {
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No images provided' });
        }

        const uploadPromises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    async (error, result) => {
                        if (error) return reject(error);

                        // Lưu link ảnh vào DB
                        const newImage = await ProductImage.create({
                            product_id: productId,
                            image: result.secure_url,
                        });
                        resolve(newImage);
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
        });

        const images = await Promise.all(uploadPromises);

        res.status(201).json({
            message: 'Images uploaded successfully',
            images,
        });
    } catch (error) {
        console.error('Error uploading product images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteProductImage = async (req, res) => {
    const { id } = req.params;

    try {
        // Tìm ảnh theo ID
        const image = await ProductImage.findByPk(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Lấy public_id từ URL Cloudinary
        const publicId = image.image.split('/').pop().split('.')[0];

        // Xoá ảnh trên Cloudinary
        await cloudinary.uploader.destroy(`products/${publicId}`);

        // Xoá khỏi database
        await image.destroy();

        return res.status(200).json({ message: 'Image deleted successfully' });
    } catch (err) {
        console.error('Error deleting image:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
