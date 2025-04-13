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
const AddressModel = require("./address.model")
const RefreshTokenModel = require("./refresh.model");
const CountryModel = require("./country.model");
const BrandModel = require("./brand.model");
const OriginModel = require("./origin.model");
const MedicalObjectModel = require("./medical_object.model");
const IndicationModel = require("./indication.model");
const CategoryModel = require("./category.model");



// Import hàm thiết lập quan hệ
const setupUserRoleAssociations = require("../associations/user-role.association");


// Khởi tạo models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const UserRole = UserRoleModel(sequelize, DataTypes);
const Address = AddressModel(sequelize, DataTypes);
const RefreshToken = RefreshTokenModel(sequelize, DataTypes);
const Doctor = DoctorModel(sequelize, DataTypes);
const Department = DepartmentModel(sequelize, DataTypes);
const Country = CountryModel(sequelize, DataTypes);
const Brand = BrandModel(sequelize, DataTypes);
const Origin = OriginModel(sequelize, DataTypes);
const MedicalObject = MedicalObjectModel(sequelize, DataTypes);
const Indication = IndicationModel(sequelize, DataTypes); 
const Category = CategoryModel(sequelize, DataTypes);
const Schedule = ScheduleModel(sequelize, DataTypes);
const GeneralPackage = GeneralPackageModel(sequelize, DataTypes);
const MedicalPackage = MedicalPackageModel(sequelize, DataTypes);




Doctor.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Doctor, { foreignKey: 'department_id', as: 'doctors' });

Schedule.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor'});
Doctor.hasMany(Schedule, { foreignKey: 'doctor_id', as: 'schedule'});




// Tạo đối tượng db để xuất tất cả models
const db = {
  sequelize,
  User,
  Role,
  Doctor,
  Department,
  Schedule,
  UserRole,
  GeneralPackage,
  MedicalPackage
  Address,
  RefreshToken,
  Country,
  Brand,
  Origin,
  MedicalObject,
  Indication,
  Category
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

