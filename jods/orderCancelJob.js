const cron = require('node-cron');
const { Op } = require('sequelize');
const { Order } = require('../models');

// ⏰ Chạy mỗi phút
cron.schedule('* * * * *', async () => {
  const now = new Date();

  // Đặt thời gian timeout là 15 phút
  const timeoutMinutes = 15;

  // Tìm các đơn hàng chưa thanh toán và đã quá 15 phút
  const expiredOrders = await Order.findAll({
    where: {
      status: 'unpaid',
      createdAt: {
        [Op.lte]: new Date(now.getTime() - timeoutMinutes * 60 * 1000),
      },
    },
  });

  for (const order of expiredOrders) {
    order.status = 'cancelled';
    await order.save();
    console.log(`Đơn hàng ${order.id} đã bị huỷ do quá thời gian thanh toán`);
  }
});
