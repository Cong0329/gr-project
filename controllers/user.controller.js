
const { User, Role } = require('../models');
const cloudinary = require('../utils/cloudinary');
const bcrypt = require('bcrypt');
const { fn, col, literal } = require("sequelize");
// Lấy thông tin người dùng hiện tại
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'avatar_url', 'phone', 'gender'],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'code', 'name'],
          through: { attributes: [] }
        },
      ]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Lấy thông tin role
    const roles = await req.user.getRoles();
    const rolesList = roles.map(role => ({
      id: role.id,
      name: role.name,
      code: role.code
    }));

    res.json({
      ...user.toJSON(),
      roles: rolesList
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Lấy danh sách user (chỉ admin mới có quyền)
exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: users } = await User.findAndCountAll({
      where: { is_deleted: false },
      offset,
      limit,
      attributes: ['id', 'name', 'phone', 'gender', 'email'],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'code', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      totalUsers: count,
      totalPages,
      currentPage: page,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  const { name, phone, gender, password } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Nếu có file ảnh thì upload lên Cloudinary
    if (req.file) {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'users' },
          async (error, result) => {
            if (error) return reject(error);
            user.avatar_url = result.secure_url;
            resolve();
          }
        );
        uploadStream.end(req.file.buffer);
      });
    }

    // Cập nhật thông tin nếu có
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;

    // Nếu có password thì kiểm tra role
    if (password !== undefined) {
      const roles = await user.getRoles();
      const hasValidRole = roles.some(role =>
        ['ROLE_ADMIN', 'ROLE_PHARMACIST'].includes(role.code)
      );

      if (!hasValidRole) {
        return res.status(403).json({
          message: 'You do not have permission to change the password.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    user.updated_at = new Date();
    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        email: user.email,
        avatar_url: user.avatar_url,
        name: user.name,
        phone: user.phone,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.hideUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.is_deleted = true;
    await user.save();

    res.json({ message: "User has been hidden (soft deleted)." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};

exports.getUserStatsByMonth = async (req, res) => {
  try {
    const stats = await User.findAll({
      attributes: [
        [Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "user_count"]
      ],
      where: {
        is_deleted: false // Bỏ qua user bị ẩn nếu cần
      },
      group: [Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("createdAt")), "ASC"]]
    });

    res.json(stats);
  } catch (error) {
    console.error("Error generating stats:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
exports.getUserStatsWithGrowth = async (req, res) => {
  try {
    const rawData = await User.findAll({
      attributes: [
        // Format tháng thành 'YYYY-MM' trong MySQL
        [fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "month"],
        [fn("COUNT", col("id")), "user_count"]
      ],
      where: {
        is_deleted: false
      },
      group: [literal("DATE_FORMAT(createdAt, '%Y-%m')")],
      order: [[literal("DATE_FORMAT(createdAt, '%Y-%m')"), "ASC"]]
    });

    const stats = rawData.map(row => ({
      month: row.get("month"),
      user_count: parseInt(row.get("user_count"), 10)
    }));

    const result = stats.map((item, index) => {
      if (index === 0) {
        return { ...item, growth: null };
      }

      const prev = stats[index - 1].user_count;
      const growth = prev === 0
        ? null
        : parseFloat(((item.user_count - prev) / prev * 100).toFixed(2));

      return { ...item, growth };
    });

    res.json(result);
  } catch (error) {
    console.error("Error in getUserStatsWithGrowth:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};