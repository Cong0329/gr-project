// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Import models
const UserModel = require('./user.model');
const RoleModel = require('./role.model');
const DoctorModel = require('./doctor.model');
const DepartmentModel = require('./department.model');
const UserModel = require("./user.model");
const RoleModel = require("./role.model");
const UserRoleModel = require("./user-role.model"); // (Nếu có model trung gian)

// Import hàm thiết lập quan hệ
const setupUserRoleAssociations = require("../associations/user-role.association");


// Khởi tạo models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const UserRole = UserRoleModel(sequelize, DataTypes);
const Doctor = DoctorModel(sequelize, DataTypes);
const Department = DepartmentModel(sequelize, DataTypes);


// Define relationships
Doctor.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(Doctor, { foreignKey: 'department_id' });




// Gọi hàm thiết lập quan hệ từ file riêng
setupUserRoleAssociations(User, Role, UserRole); 

// Xuất các model và sequelize
module.exports = {
  sequelize,
  User,
  Role,
  Doctor,
  Department,
  UserRole,
};

