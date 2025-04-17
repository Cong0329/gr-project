const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredient.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), ingredientController.createIngredient);
router.patch('/:id', authenticateToken, requireRole('ROLE_ADMIN'), ingredientController.updateIngredient);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), ingredientController.deleteIngredient);

module.exports = router;