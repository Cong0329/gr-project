require('dotenv').config(); // Load biến môi trường từ .env
const mysql = require('mysql2');

// Cấu hình kết nối MySQL sử dụng biến môi trường
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    timezone: process.env.DB_TIMEZONE,
    ssl: process.env.DB_SSL === 'true',
    dialect: process.env.DB_DIALECT,
});

// Kết nối với MySQL
connection.connect((err) => {
    if (err) {
        console.error('❌ Kết nối MySQL thất bại:', err.message);
        return;
    }
    console.log('✅ Kết nối MySQL thành công!');
});

module.exports = connection;
