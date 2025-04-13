// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Import models
const DoctorModel = require('./doctor.model');
const DepartmentModel = require('./department.model');
const UserModel = require("./user.model");
const RoleModel = require("./role.model");
const UserRoleModel = require("./user-role.model"); // (Nếu có model trung gian)
const GeneralPackageModel = require('./general-pkg.model');
const MedicalPackageModel = require('./medical-pkg.model');
const ScheduleModel = require('./schedule.model');


// Import hàm thiết lập quan hệ
const setupUserRoleAssociations = require("../associations/user-role.association");


// Khởi tạo models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const UserRole = UserRoleModel(sequelize, DataTypes);
const Doctor = DoctorModel(sequelize, DataTypes);
const Department = DepartmentModel(sequelize, DataTypes);
const Schedule = ScheduleModel(sequelize, DataTypes);
const GeneralPackage = GeneralPackageModel(sequelize, DataTypes);
const MedicalPackage = MedicalPackageModel(sequelize, DataTypes);

// Define relationships
User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });
Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });

Doctor.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Doctor, { foreignKey: 'department_id', as: 'doctors' });

Schedule.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor'});
Doctor.hasMany(Schedule, { foreignKey: 'doctor_id', as: 'schedule'});




// Gọi hàm thiết lập quan hệ từ file riêng
setupUserRoleAssociations(User, Role, UserRole); 

// Xuất các model và sequelize
module.exports = {
  sequelize,
  User,
  Role,
  Doctor,
  Department,
  Schedule,
  UserRole,
  GeneralPackage,
  MedicalPackage
};

