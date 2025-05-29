
module. exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: DataTypes.STRING,
    gender: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
    avatar_url: DataTypes.STRING,
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: DataTypes.STRING,
    provider: DataTypes.STRING,
    provider_id: DataTypes.STRING,
    verify_code: { type: DataTypes.INTEGER, allowNull: true },
    verify_code_expires_at: { type: DataTypes.DATE, allowNull: true },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'user',
    timestamps: true
  });

  User.associate = function(models) {
    User.hasMany(models.PackageBookingRequest, {
      foreignKey: 'user_id',
      as: 'bookingRequests'
    });
    
    User.hasOne(models.Doctor, {
      foreignKey: 'user_id',
      as: 'doctorProfile',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  
  User.prototype.isDoctor = async function() {
    const doctorProfile = await this.getDoctorProfile();
    return doctorProfile !== null;
  };

  User.prototype.getDoctorInfo = async function() {
    return await this.getDoctorProfile({
      include: [
        {
          model: sequelize.models.Department,
          as: 'department',
          attributes: ['id', 'name']
        }
      ]
    });
  };

  return User;
};