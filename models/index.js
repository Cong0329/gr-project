const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import models
const UserModel = require('./user.model');
const RoleModel = require('./role.model');
const DoctorModel = require('./doctor.model');
const DepartmentModel = require('./department.model');


// Khởi tạo models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const Doctor = DoctorModel(sequelize, DataTypes);
const Department = DepartmentModel(sequelize, DataTypes);


// Define relationships
User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });
Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });
Doctor.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(Doctor, { foreignKey: 'department_id' });



module.exports = {
  sequelize,
  User,
  Role,
  Doctor,
  Department
};
