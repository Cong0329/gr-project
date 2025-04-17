const { Cart, CartItem, Product, ProductOption, ProductImage } = require('../models');

exports.addToCart = async (req, res) => {
  try {

    const { product_id, option_id, quantity } = req.body;
    const user_id = req.user.id;

    // 1. Tìm hoặc tạo cart
    let cart = await Cart.findOne({ where: { user_id } });
    if (!cart) {
      cart = await Cart.create({ user_id });
    }

    // 2. Kiểm tra xem cart item đã tồn tại chưa
    const [item, created] = await CartItem.findOrCreate({
      where: {
        cart_id: cart.id,
        product_id,
        option_id,
      },
      defaults: {
        quantity
      }
    });

    // 3. Nếu đã tồn tại thì cập nhật số lượng
    if (!created) {
      item.quantity += quantity;
      await item.save();
    }

    return res.status(200).json({
      message: created ? 'Cart item created' : 'Cart item updated',
      item,
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getCartByUser = async (req, res) => {
  try {
    const userId = req.user.id; // hoặc req.params.userId nếu không dùng auth middleware

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          attributes: { exclude: ['cart_id', 'product_id', "option_id", 'created_at', 'updated_at'] },
          include: [
            {
              model: Product,
              as: 'product',
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
              attributes: ['id', 'label', 'price', 'discounted_price']
            }
          ]
        }
      ]
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error('Error getting cart:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity, option_id } = req.body;

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [
        {
          model: ProductOption,
          as: 'option',
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Nếu có đổi option
    if (option_id && option_id !== cartItem.option_id) {
      const newOption = await ProductOption.findByPk(option_id);
      if (!newOption) {
        return res.status(404).json({ message: 'Option not found' });
      }

      // Kiểm tra xem đã có item trùng với product + option mới chưa
      const existingItem = await CartItem.findOne({
        where: {
          cart_id: cartItem.cart_id,
          product_id: cartItem.product_id,
          option_id,
        },
      });

      if (existingItem) {
        // Gộp số lượng
        existingItem.quantity += quantity || 1;
        await existingItem.save();

        // Xoá cart item hiện tại
        await cartItem.destroy();

        return res.status(200).json({
          message: 'Cart item updated and merged successfully',
          cartItem: existingItem,
        });
      }

      // Nếu chưa có thì chỉ update option
      cartItem.option_id = option_id;
    }

    // Update quantity nếu có
    if (quantity && quantity > 0) {
      cartItem.quantity = quantity;
    } else {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    await cartItem.save();

    res.status(200).json({
      message: 'Cart item updated successfully',
      cartItem,
    });
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();

    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
