module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define('RefreshToken', {
      token: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  
    RefreshToken.associate = (models) => {
      RefreshToken.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    };
  
    return RefreshToken;
  };
  