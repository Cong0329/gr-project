const crypto = require('crypto');
const qs = require('qs');
const { Order } = require('../models');
require('dotenv').config();
const { sortObject } = require('../utils/sortObjectPayment');

exports.vnpayReturn = async (req, res) => {
  try {
    let vnpParams = req.query;
    const secureHash = vnpParams.vnp_SecureHash;

    // ❌ Xoá các param hash ra trước khi xử lý
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // ✅ Sắp xếp object theo key
    vnpParams = sortObject(vnpParams);

    // ✅ Tạo signData
    const signData = qs.stringify(vnpParams, { encode: false });

    // ✅ Tính lại secureHash
    const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET);
    const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // ✅ So sánh
    if (secureHash !== checkSum) {
      return res.status(400).json({ message: 'Invalid checksum' });
    }

    // ✅ Xử lý trạng thái đơn hàng
    const orderId = vnpParams.vnp_TxnRef;
    const responseCode = vnpParams.vnp_ResponseCode;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (responseCode === '00') {
      order.status = 'pending'; // thành công, chờ xác nhận
    } else {
      order.status = 'cancelled'; // thanh toán thất bại
    }

    await order.save();

    // ✅ Redirect về client với kết quả
    return res.redirect(`${process.env.CLIENT_URL}?order_id=${order.id}&status=${order.status}`);
  } catch (error) {
    console.error('VNPay return error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
