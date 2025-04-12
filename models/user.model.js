const { unique } = require("jquery");

module.exports = (sequelize, DataTypes) => {
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
    email: { type: DataTypes.STRING, allowNull: false },
    provider: DataTypes.STRING,
    provider_id: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: DataTypes.DATE,
    created_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT
  }, {
    tableName: 'user',
    timestamps: false
  });

  return User;
};
