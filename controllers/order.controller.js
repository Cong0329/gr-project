// controllers/orderController.js
const { or } = require('sequelize');
const { Order, CartItem, Address, PaymentMethod, OrderItem, Cart, ProductOption, User, Product, ProductImage } = require('../models');
const { buildVNPayUrl } = require('../utils/vnpay');
// POST /orders
// Create Order with vnpay payment method
exports.createOrder = async (req, res) => {
  try {
    const { shipping_address_id, cartItemIds, payment_method, note } = req.body;
    const user_id = req.user.id;

    // Validate shipping address
    const shippingAddress = await Address.findOne({
      where: { id: shipping_address_id, user_id },
    });

    if (!shippingAddress) {
      return res.status(404).json({ message: 'Shipping address not found' });
    }

    // Validate payment method
    const paymentMethod = await PaymentMethod.findOne({ where: { method: payment_method } });

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Lấy các cart item cần order
    const cartItems = await CartItem.findAll({
      where: {
        id: cartItemIds,
      },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id },
        },
        {
          model: ProductOption,
          as: 'option',
        },
      ],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'No valid cart items found' });
    }



    // Tính tổng giá
    let totalPrice = 0;
    cartItems.forEach((item) => {
      const option = item.option?.get();
      const price = parseFloat(option?.discounted_price) > 0
        ? parseFloat(option.discounted_price)
        : parseFloat(option.price);
      totalPrice += price * item.quantity;
    });



    // Tạo order
    const order = await Order.create({
      user_id,
      shipping_address_id,
      total_price: totalPrice,
      payment_method_id: paymentMethod.id,
      status: payment_method === 'vnpay' ? 'unpaid' : 'pending',
      note,
    });

    // Tạo các order items tương ứng
    const orderItems = await Promise.all(
      cartItems.map((item) => {
        const option = item.option?.get?.() || item.option; // đảm bảo bạn lấy object thuần
        const price = parseFloat(option.discounted_price) > 0
          ? parseFloat(option.discounted_price)
          : parseFloat(option.price);
        return OrderItem.create({
          order_id: order.id,
          product_id: item.product_id,
          option_id: item.option_id,
          quantity: item.quantity,
          price,
        });
      })
    );

    // Xoá cart item đã order (nếu muốn)
    await CartItem.destroy({
      where: {
        id: cartItemIds
      },
    });
    if (payment_method === 'vnpay') {
      const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const paymentUrl = buildVNPayUrl(order.id, totalPrice, ipAddr);

      return res.status(200).json({
        message: 'Redirect to VNPay',
        paymentUrl,
        orderId: order.id,
      });
    }
    res.status(201).json({
      message: 'Order created successfully',
      order,
      orderItems,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) where.status = status; // lọc theo trạng thái nếu có

    const orders = await Order.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        {
          model: OrderItem,
          as: 'items',
          attributes: { exclude: ['product_id', 'option_id', 'order_id'] },
          include: [
            {
              model: Product,
              attributes: ['id', 'name'],
              include: [
                {
                  model: ProductImage,
                  as: 'images',
                  attributes: ['id', 'image'],
                  limit: 1
                }
              ]
            },
            {
              model: ProductOption,
              as: 'option',
              attributes: ['label']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get order by Id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'price'] }]
        }
      ],
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error('Get order by ID error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending','confirmed', 'shipping', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Get order by user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'price'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Cancel order
exports.cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id; // từ middleware auth

  try {
    const order = await Order.findOne({ where: { id: orderId, user_id: userId } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Chỉ cấm hủy nếu đang giao hoặc đã giao xong
    if (['shipping', 'completed'].includes(order.status)) {
      return res.status(400).json({ message: 'This order cannot be canceled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order canceled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






