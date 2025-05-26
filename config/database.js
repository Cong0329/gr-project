const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,

    timezone: '+07:00', // 👉 Giờ Việt Nam cho Sequelize

    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
    },
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Kết nối MySQL thành công!');
  })
  .catch((err) => {
    console.error('❌ Kết nối MySQL thất bại:', err.message);
  });

// Sync database tự động cập nhật schema mà không mất dữ liệu
sequelize.sync({ alter: false })
  .then(() => console.log('✅ DB synced (altered without data loss)'))
  .catch(err => console.error('❌ DB sync error:', err));
  
module.exports = sequelize; 
