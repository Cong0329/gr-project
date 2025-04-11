const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql', // fallback nếu chưa set env
    logging: false, // không log SQL nếu không cần
  }
);

const User = sequelize.define('user', {
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
  provider: DataTypes.STRING,
  provider_id: DataTypes.STRING,

  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  deleted_at: DataTypes.DATE,

  created_by: DataTypes.BIGINT,
  updated_by: DataTypes.BIGINT,
  deleted_by: DataTypes.BIGINT
}, {
  tableName: 'user',
  timestamps: false, // tự quản lý timestamps
  paranoid: false,   // vì bạn đang dùng `deleted_at` custom
});

module.exports = {
  sequelize,
  User
};
