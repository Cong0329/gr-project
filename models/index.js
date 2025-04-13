const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import models
const UserModel = require('./user.model');
const RoleModel = require('./role.model');
const DoctorModel = require('./doctor.model');
const DepartmentModel = require('./department.model');
const ScheduleModel = require('./schedule.model');

// Initialize models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const Doctor = DoctorModel(sequelize, DataTypes);
const Department = DepartmentModel(sequelize, DataTypes);
const Schedule = ScheduleModel(sequelize, DataTypes);
// GeneralPkg and MedicalPkg are temporarily commented out

// Define relationships
User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });
Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });

Doctor.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Doctor, { foreignKey: 'department_id' });

Schedule.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
Doctor.hasMany(Schedule, { foreignKey: 'doctor_id' });

/*
Schedule.associate = function(models) {
  Schedule.belongsTo(models.Doctor, { foreignKey: 'doctor_id' });
  
  Schedule.belongsTo(models.GeneralPkg, {
    foreignKey: 'service_id',
    constraints: false,
    scope: {
      type: 'general'
    }
  });
  
  Schedule.belongsTo(models.MedicalPkg, {
    foreignKey: 'service_id',
    constraints: false,
    scope: {
      type: 'medical'
    }
  });
  
  Schedule.belongsTo(models.Department, {
    foreignKey: 'department_id',
    constraints: false,
    scope: {
      type: 'specialist'
    }
  });
};
*/

module.exports = {
  sequelize,
  User,
  Role,
  Doctor,
  Department,
  Schedule,
};