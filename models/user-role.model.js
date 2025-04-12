// models/user-role.model.js
module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define(
      "UserRole",
      {
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        // Thêm các trường tùy chỉnh khác nếu cần
        assigned_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: "user_role",
        timestamps: false, // Tắt tự động tạo createdAt, updatedAt
      }
    );
  
    return UserRole;
  };