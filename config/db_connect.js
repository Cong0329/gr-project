const mysql = require('mysql2');

// Cấu hình kết nối tương tự Spring Boot
const connection = mysql.createConnection({
    host: '34.58.238.108',  // Địa chỉ IP máy chủ MySQL
    user: 'root',           // Tên người dùng
    password: '23476985HUbK', // Mật khẩu
    database: 'booking_db', // Tên database
    port: 3306,             // Cổng mặc định MySQL
    timezone: 'Z',          // Tương đương với `serverTimezone=UTC` trong Spring Boot
    ssl: false              // Tương đương với `useSSL=false`
});

// Kết nối với MySQL
connection.connect((err) => {
    if (err) {
        console.error('❌ Kết nối MySQL thất bại:', err.message);
        return;
    }
    console.log('✅ Kết nối MySQL thành công!');
});

// Xuất kết nối để dùng trong các file khác
module.exports = connection;
