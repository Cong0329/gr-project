// controllers/orderController.js

const { Order, CartItem, Address, PaymentMethod, OrderItem, Cart, ProductOption, User, Product, ProductImage, OrderStatusHistory } = require('../models');
const { buildVNPayUrl } = require('../utils/vnpay');
const { sendOrderConfirmedEmail } = require('../utils/mailService');
const { fn, col, Op, literal } = require("sequelize");
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
    let nonDiscount = 0;
    cartItems.forEach((item) => {
      const option = item.option?.get();
      const price = parseFloat(option?.price);
      nonDiscount += price * item.quantity;
    });



    // Tạo order
    const order = await Order.create({
      user_id,
      shipping_address_id,
      total_price: totalPrice,
      discout_price: nonDiscount,
      payment_method_id: paymentMethod.id,
      status: payment_method === 'vnpay' ? 'unpaid' : payment_method === 'cod' ? 'pending' : 'pending',
      note,
    });

    await OrderStatusHistory.create({
      order_id: order.id,
      status: order.status,
      changed_at: new Date(),
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
          option: option.label,
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
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product, as: 'product', attributes: ['id', 'name'],
              include: [{ model: ProductImage, as: 'images', attributes: ['id', 'image'], limit: 1 }]
            },
          ],
          attributes: { exclude: ['product_id', 'order_id', 'createdAt', 'updatedAt'] }
        },
        {
          model: Address,
          as: 'shipping_address',
          attributes: { exclude: ['user_id', 'createdAt', 'updatedAt'] }
        }, {
          model: PaymentMethod,
          as: 'payment_method',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
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
      attributes: { exclude: ['user_id', 'shipping_address_id', 'payment_method_id'] },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        {
          model: OrderStatusHistory,
          as: 'status_history',
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product, as: 'product', attributes: ['id', 'name'],
              include: [{ model: ProductImage, as: 'images', attributes: ['id', 'image'], limit: 1 }]
            },
          ],
          attributes: { exclude: ['product_id', 'order_id', 'createdAt', 'updatedAt'] }
        },
        {
          model: Address,
          as: 'shipping_address',
          attributes: { exclude: ['user_id', 'createdAt', 'updatedAt'] }
        }, {
          model: PaymentMethod,
          as: 'payment_method',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error('Get order by ID error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update order status
exports.confirmOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Address, as: 'shipping_address', attributes: { exclude: ['user_id', 'createdAt', 'updatedAt'] } },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                {
                  model: ProductImage,
                  as: 'images',
                  limit: 1, // chỉ lấy 1 ảnh đại diện
                }
              ]
            }
          ]
        }
      ]
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be confirmed' });
    }

    // Trừ sản phẩm
    if (order.items && order.items.length > 0) {
      await Promise.all(order.items.map(async (item) => {
        const product = item.product;
        if (product) {
          product.quantity -= item.quantity;
          await product.save();
        }
      }));
    }

    const formattedItems = order.items.map(item => {
      const product = item.product;
      const imageUrl = product.images?.[0]?.image || 'https://via.placeholder.com/60';

      return {
        name: product.name,
        quantity: item.quantity,
        price: item.price,
        option: item.option || '—',
        image: imageUrl
      };
    });



    order.status = 'confirmed';
    await order.save();

    await OrderStatusHistory.create({
      order_id: order.id,
      status: 'confirmed',
    });

    // Gửi mail
    await sendOrderConfirmedEmail(
      order.user.email,
      order.user.name,
      {
        id: order.id,
        items: formattedItems,
        address: order.shipping_address,
      }
    );


    res.json({ message: 'Order confirmed and email sent', order });
  } catch (err) {
    console.error('Confirm order error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get order by user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { user_id: userId },
      attributes: { exclude: ['user_id', 'shipping_address_id', 'payment_method_id'] },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product, as: 'product', attributes: ['id', 'name'],
              include: [{ model: ProductImage, as: 'images', attributes: ['id', 'image'], limit: 1 }]
            },
          ],
          attributes: { exclude: ['product_id', 'order_id', 'createdAt', 'updatedAt'] }
        },
        {
          model: Address,
          as: 'shipping_address',
          attributes: { exclude: ['user_id', 'createdAt', 'updatedAt'] }
        }, {
          model: PaymentMethod,
          as: 'payment_method',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
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

// Shipping order
exports.shippingOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.findOne({ where: { id: id } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed orders can be shipped' });
    }

    order.status = 'shipping';
    await order.save();

    await OrderStatusHistory.create({
      order_id: order.id,
      status: 'shipping',
    });

    res.json({ message: 'Order shipped successfully', order });
  } catch (error) {
    console.error('Shipping order error:', error);
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

exports.completeOrder = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id; // từ middleware auth

  try {
    const order = await Order.findOne({ where: { id: id, user_id: userId } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'shipping') {
      return res.status(400).json({ message: 'Only shipped orders can be completed' });
    }

    order.status = 'completed';
    await order.save();

    await OrderStatusHistory.create({
      order_id: order.id,
      status: 'completed',
    });

    res.json({ message: 'Order completed successfully', order });
  } catch (error) {
    console.error('Shipping order error:', error);
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

// Cancel order
exports.cancelOrder = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id; // từ middleware auth

  try {
    const order = await Order.findOne({
      where: { id: id, user_id: userId },
      include: {
        model: OrderItem, as: 'items',
        include: [{ model: Product, as: 'product' }]
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Chỉ cấm hủy nếu đang giao hoặc đã giao xong
    if (['shipping', 'completed'].includes(order.status)) {
      return res.status(400).json({ message: 'This order cannot be canceled' });
    }

    if (order.status === 'confirmed') {
      if (order.items && order.items.length > 0) {
        await Promise.all(order.items.map(async (item) => {
          const product = item.product;
          if (product) {
            product.quantity += item.quantity;
            await product.save();
          }
        }));
      } else {
        console.warn(`Order ${id} is confirmed but has no items. Stock not reversed.`);
      }

    }

    order.status = 'cancelled';
    await order.save();
    await OrderStatusHistory.create({
      order_id: order.id,
      status: 'shipping',
    });

    res.json({ message: 'Order canceled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getMonthlyRevenueStats = async (req, res) => {
  try {
    const rawData = await Order.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "month"],
        [fn("COUNT", col("id")), "order_count"],
        [fn("SUM", col("total_price")), "total_revenue"],
        [fn("SUM", col("discout_price")), "total_discount"]
      ],
      where: {
        status: "completed" // Lọc đơn hàng đã hoàn thành
      },
      group: [literal("DATE_FORMAT(createdAt, '%Y-%m')")],
      order: [[literal("DATE_FORMAT(createdAt, '%Y-%m')"), "ASC"]]
    });

    const stats = rawData.map(row => ({
      month: row.get("month"),
      order_count: parseInt(row.get("order_count"), 10),
      total_revenue: parseFloat(row.get("total_revenue")),
      total_discount: parseFloat(row.get("total_discount"))
    }));

    // Tính phần trăm tăng trưởng doanh thu theo tháng
    const result = stats.map((item, index) => {
      if (index === 0) {
        return { ...item, revenue_growth: null };
      }

      const prevRevenue = stats[index - 1].total_revenue;
      const growth = prevRevenue === 0
        ? null
        : parseFloat(((item.total_revenue - prevRevenue) / prevRevenue * 100).toFixed(2));

      return { ...item, revenue_growth: growth };
    });

    res.json(result);
  } catch (error) {
    console.error("Error in getMonthlyRevenueStats:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};



exports.getRevenueStats = async (req, res) => {
  try {
    const { date, month } = req.query;

    let startDate, endDate;

    if (date) {
      // Nếu truyền ngày: tính từ 00:00 đến 23:59 ngày đó
      startDate = new Date(`${date}T00:00:00.000Z`);
      endDate = new Date(`${date}T23:59:59.999Z`);
    } else if (month) {
      // Nếu truyền tháng: tính từ đầu tháng đến cuối tháng
      const [year, mon] = month.split("-");
      const monthInt = parseInt(mon, 10);
      startDate = new Date(year, monthInt - 1, 1, 0, 0, 0, 0);
      endDate = new Date(year, monthInt, 0, 23, 59, 59, 999); // ngày cuối tháng
    } else {
      return res.status(400).json({ message: "Bạn cần truyền 'date' hoặc 'month'." });
    }

    const data = await Order.findOne({
      attributes: [
        [fn("SUM", col("total_price")), "total_revenue"],
        [fn("SUM", col("discout_price")), "total_discount"],
        [fn("COUNT", col("id")), "order_count"]
      ],
      where: {
        status: "completed",
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    res.json({
      time_range: date || month,
      total_revenue: parseFloat(data.get("total_revenue")) || 0,
      total_discount: parseFloat(data.get("total_discount")) || 0,
      order_count: parseInt(data.get("order_count"), 10) || 0
    });
  } catch (error) {
    console.error("Error in getRevenueStats:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};