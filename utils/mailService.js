const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOrderConfirmedEmail = async (to, customerName, order) => {
  const productRows = order.items.map(item => {
    return `
      <tr style="text-align: center;">
        <td><img src="${item.image}" alt="${item.name}" width="60" /></td>
        <td>${item.name}</td>
        <td>${item.option || '—'}</td>
        <td>${item.quantity}</td>
        <td>${parseFloat(item.price).toLocaleString()} đ</td>
        <td>${(item.quantity * item.price).toLocaleString()} đ</td>
      </tr>
    `;
  }).join('');

  const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString();

  const address = order.address
    ? `${order.address.street},${order.address.ward}, ${order.address.district}, ${order.address.province}`
    : '—';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Xác nhận đơn hàng #${order.id}`,
    html: `
      <h2>Cảm ơn bạn ${customerName} đã đặt hàng!</h2>
      <p><strong>Mã đơn hàng:</strong> #${order.id}</p>

      <h3>Thông tin người nhận:</h3>
      <p><strong>Tên:</strong> ${order.address?.name || '—'}</p>
      <p><strong>SĐT:</strong> ${order.address?.phone || '—'}</p>
      <p><strong>Địa chỉ:</strong> ${address}</p>

      <h3>Chi tiết sản phẩm:</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: #f2f2f2;">
          <tr style="text-align: center;">
            <th>Ảnh</th>
            <th>Tên SP</th>
            <th>Option</th>
            <th>SL</th>
            <th>Giá</th>
            <th>Tạm tính</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>

      <p style="margin-top: 20px;"><strong>Tổng cộng:</strong> ${totalPrice} đ</p>
      <p>Chúng tôi sẽ liên hệ bạn sớm để xác nhận và giao hàng.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
