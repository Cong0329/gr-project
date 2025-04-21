// models/payment_method.js
module.exports = (sequelize, DataTypes) => {
    const PaymentMethod = sequelize.define('PaymentMethod', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,  // Đảm bảo mỗi phương thức thanh toán chỉ có 1 bản ghi
        },
        description: {
            type: DataTypes.STRING,
        },
    }, 
    {
        tableName: 'payment_method',
        timestamps: true
    }
);

    PaymentMethod.associate = (models) => {
        PaymentMethod.hasMany(models.Order, { foreignKey: 'payment_method_id' });
    };

    return PaymentMethod;
};
