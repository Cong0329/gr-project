const { Review, User, Product, ReviewReply } = require("../models");
const { Sequelize } = require("sequelize");


exports.createReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.create({ product_id: productId, rating, comment, user_id: userId });
    const user = await User.findByPk(userId);
    const product = await Product.findByPk(productId);

    // Gửi socket tới tất cả admin đang online
    req.io.to("admins").emit("new-review", {
        product,
        user,
        comment,
        rating,
        createdAt: new Date(),
    });

    res.status(201).json({ message: "Đánh giá đã được gửi", review });
};

exports.replyToReview = async (req, res) => {
    const reviewId = req.params.id;
    const { reply } = req.body;
    const adminId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ message: 'Đánh giá không tồn tại' });

    const created = await ReviewReply.create({
        review_id: reviewId,
        reply,
        admin_id: adminId,
    });

    res.status(201).json({ message: 'Phản hồi đã được gửi', created });
};

exports.updateReviewReply = async (req, res) => {
    try {
        const replyId = req.params.replyId;
        const { reply } = req.body;
        const adminId = req.user.id; // Lấy từ middleware xác thực

        const existingReply = await ReviewReply.findByPk(replyId);

        if (!existingReply) {
            return res.status(404).json({ message: 'Phản hồi không tồn tại' });
        }

        if (existingReply.admin_id !== adminId) {
            return res.status(403).json({ message: 'Bạn không có quyền sửa phản hồi này' });
        }

        existingReply.reply = reply;
        await existingReply.save();

        res.json({ message: 'Cập nhật phản hồi thành công', updated: existingReply });
    } catch (error) {
        console.error('Update review reply error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getAllPendingReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            attributes: { exclude: ['user_id', 'product_id'] },
            include: [
                {
                    model: ReviewReply,
                    as: 'reply',
                    required: false, // left join
                    attributes: ['id'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'avatar_url']
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name']
                }
            ],
            where: Sequelize.literal(`
          NOT EXISTS (
            SELECT 1 FROM review_replies r 
            WHERE r.review_id = Review.id
          )
        `),
            order: [['createdAt', 'DESC']],
        });

        res.json(reviews);
    } catch (error) {
        console.error('Get pending reviews error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                {
                    model: ReviewReply,
                    as: 'reply',
                    attributes: ['id', 'reply', 'updatedAt', 'createdAt'],
                    include: {
                        model: User,
                        as: 'admin',
                        attributes: ['id', 'name', 'email'],
                    }
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'avatar_url']
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(reviews);
    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.findAll({
            where: { product_id: productId },
            attributes: { exclude: ['user_id', 'product_id'] },
            include: [
                {
                    model: ReviewReply,
                    as: 'reply',
                    attributes: ['id', 'reply', 'createdAt', 'updatedAt'],
                    include: {
                        model: User,
                        as: 'admin',
                        attributes: ['id', 'name', 'email']
                    }
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'avatar_url']
                },
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(reviews);
    } catch (error) {
        console.error('Get reviews by product error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};