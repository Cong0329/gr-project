const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import models
const UserModel = require('./user.model');
const RoleModel = require('./role.model');

// Khởi tạo models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);

// Define relationships
User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });
Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });

module.exports = {
  sequelize,
  User,
  Role
};
