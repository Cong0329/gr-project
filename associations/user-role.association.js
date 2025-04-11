// models/user-role.association.js
const setupUserRoleAssociations = (User, Role, UserRole) => {
  // Thiết lập quan hệ many-to-many
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: "user_id",
    as: "roles", // Optional: Tên alias cho mối quan hệ
  });

  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: "role_id",
    as: "users", // Optional: Tên alias cho mối quan hệ
  });

  // (Optional) Quan hệ trực tiếp với bảng trung gian
  UserRole.belongsTo(User, { foreignKey: "user_id" });
  UserRole.belongsTo(Role, { foreignKey: "role_id" });
};

// Export hàm dưới dạng default
module.exports = setupUserRoleAssociations; // 🚨 Sửa tên hàm export!