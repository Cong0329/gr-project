// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Import models
const DoctorModel = require('./doctor.model');
const DepartmentModel = require('./department.model');
const UserModel = require("./user.model");
const RoleModel = require("./role.model");
const UserRoleModel = require("./user-role.model"); // (Nếu có model trung gian)
const ServicePackageModel = require('./service-pkg.model');
const ScheduleModel = require('./schedule.model');
const AddressModel = require("./address.model")
const RefreshTokenModel = require("./refresh.model");
const CountryModel = require("./country.model");
const BrandModel = require("./brand.model");
const OriginModel = require("./origin.model");
const MedicalObjectModel = require("./medical_object.model");
const IndicationModel = require("./indication.model");
const CategoryModel = require("./category.model");
const ServiceCategoryModel = require("./service-category.model")
const ServiceItemModel = require("./service-item.model")
const PackageItemModel = require("./package-item.model")


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
const ServicePackage = ServicePackageModel(sequelize, DataTypes);
const ServiceCategory = ServiceCategoryModel(sequelize, DataTypes)
const ServiceItem = ServiceItemModel(sequelize, DataTypes)
const PackageItem = PackageItemModel(sequelize, DataTypes)


// Tạo đối tượng db để xuất tất cả models
const db = {
  sequelize,
  User,
  Role,
  Doctor,
  Department,
  Schedule,
  UserRole,
  ServicePackage,
  Address,
  RefreshToken,
  Country,
  Brand,
  Origin,
  MedicalObject,
  Indication,
  Category,
  ServiceCategory,
  ServiceItem,
  PackageItem
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

