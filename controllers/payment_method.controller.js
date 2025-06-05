
const crypto = require('crypto');
const qs = require('qs');
const { Order, PaymentMethod, OrderStatusHistory, Appointment } = require('../models');
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
      await OrderStatusHistory.create({
        order_id: order.id,
        status: order.status,
        changed_at: new Date(),
      });
    } else {
      order.status = 'cancelled'; // thanh toán thất bại
      await OrderStatusHistory.create({
        order_id: order.id,
        status: order.status,
        changed_at: new Date(),
      });
    }

    await order.save();

    // ✅ Redirect về client với kết quả
    return res.redirect(`${process.env.CLIENT_URL}?order_id=${order.id}&status=${order.status}`);
  } catch (error) {
    console.error('VNPay return error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.vnpayReturnApointment = async (req, res) => {
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
    const apointmentId = vnpParams.vnp_TxnRef;
    const responseCode = vnpParams.vnp_ResponseCode;

    const apointment = await Appointment.findByPk(apointmentId);
    if (!apointment) return res.status(404).json({ message: 'Appointment not found' });

    if (responseCode === '00') {
      apointment.status = 'confirmed'; // thành công, chờ xác nhận
      apointment.payment_status = 'confirmed';
    } else {
      apointment.status = 'cancelled'; // thanh toán thất bại
      apointment.payment_status = 'failed';
    }

    await apointment.save();

    // ✅ Redirect về client với kết quả
    return res.redirect(`${process.env.CLIENT_BOOKING_URL}?apointment_id=${apointment.id}&status=${apointment.status}`);
  } catch (error) {
    console.error('VNPay return error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.vnpayReturnPackage = async (req, res) => {
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
      await OrderStatusHistory.create({
        order_id: order.id,
        status: order.status,
        changed_at: new Date(),
      });
    } else {
      order.status = 'cancelled'; // thanh toán thất bại
      await OrderStatusHistory.create({
        order_id: order.id,
        status: order.status,
        changed_at: new Date(),
      });
    }

    await order.save();

    // ✅ Redirect về client với kết quả
    return res.redirect(`${process.env.CLIENT_URL}?order_id=${order.id}&status=${order.status}`);
  } catch (error) {
    console.error('VNPay return error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.findAll({
      attributes: ['id', 'method', 'description'], // Tùy theo cdác cột bạn có
      order: [['id', 'ASC']]
    });

    res.status(200).json(methods);
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

