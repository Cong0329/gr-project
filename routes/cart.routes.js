const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, cartController.addToCart);
router.get('/', authenticateToken, cartController.getCartByUser);
router.patch('/:cartItemId', authenticateToken, cartController.updateCartItem);
router.delete('/:cartItemId', authenticateToken, cartController.deleteCartItem);


module.exports = router;

