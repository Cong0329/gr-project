// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Import models
const UserModel = require("./user.model");
const RoleModel = require("./role.model");
const UserRoleModel = require("./user-role.model"); // (Nếu có model trung gian)

// Import hàm thiết lập quan hệ
const setupUserRoleAssociations = require("../associations/user-role.association");

// Khởi tạo models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const UserRole = UserRoleModel(sequelize, DataTypes); // (Nếu có model trung gian)

// Gọi hàm thiết lập quan hệ từ file riêng
setupUserRoleAssociations(User, Role, UserRole); 

// Xuất các model và sequelize
module.exports = {
  sequelize,
  User,
  Role,
  UserRole, // (Nếu có model trung gian)
};