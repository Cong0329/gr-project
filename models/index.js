// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Import models
const UserModel = require('./user.model');
const RoleModel = require('./role.model');
const DoctorModel = require('./doctor.model');
const DepartmentModel = require('./department.model');
const UserRoleModel = require("./user-role.model");
const RefreshTokenModel = require("./refresh.model");

// Import hàm thiết lập quan hệ
const setupUserRoleAssociations = require("../associations/user-role.association");


// Khởi tạo models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const UserRole = UserRoleModel(sequelize, DataTypes);
const RefreshToken = RefreshTokenModel(sequelize, DataTypes);
const Doctor = DoctorModel(sequelize, DataTypes);
const Department = DepartmentModel(sequelize, DataTypes);


// Define relationships
Doctor.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(Doctor, { foreignKey: 'department_id' });




// Tạo đối tượng db để xuất tất cả models
const db = {
  sequelize,
  User,
  Role,
  Doctor,
  Department,
  UserRole,
  RefreshToken,
};

// Gọi hàm thiết lập quan hệ từ file riêng (nếu cần)
setupUserRoleAssociations(User, Role, UserRole); 

// Gọi associate() cho các model nếu có hàm này
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

// Xuất các model và sequelize
module.exports = db;

