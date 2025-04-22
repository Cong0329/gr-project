

// models/user-role.association.js
const setupPackageServiceAssociations = (ServicePackage, ServiceItem, PackageItem) => {
    // Thiết lập quan hệ many-to-many
    ServicePackage.belongsToMany(ServiceItem, {
      through: PackageItem,
      foreignKey: "packageId",
      as: "items", // Optional: Tên alias cho mối quan hệ
    });
  
    ServiceItem.belongsToMany(ServicePackage, {
      through: PackageItem,
      foreignKey: "itemId",
      as: "packages", // Optional: Tên alias cho mối quan hệ
    });
  
    // (Optional) Quan hệ trực tiếp với bảng trung gian
    ServicePackage.belongsTo(PackageItem, { foreignKey: "packageId" });
    ServiceItem.belongsTo(PackageItem, { foreignKey: "itemId" });
  };
  
  // Export hàm dưới dạng default
  module.exports = setupPackageServiceAssociations; // 🚨 Sửa tên hàm export!

      