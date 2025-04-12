const { User } = require('../models');

// Lấy thông tin người dùng hiện tại
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'avatar_url', 'phone', 'gender']
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
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
      offset,
      limit,
      attributes: ['id', 'name', 'phone', 'gender'],
      order: [['created_at', 'DESC']],
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
  const { name, phone, gender } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    user.updated_at = new Date();

    await user.save();
    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
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
