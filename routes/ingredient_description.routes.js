const express = require('express');
const router  = express.Router();
const ingredientDescriptionController = require('../controllers/ingredient_description.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), ingredientDescriptionController.createIngredientDescription);
router.patch('/:id', authenticateToken, requireRole('ROLE_ADMIN'), ingredientDescriptionController.updateIngredientDescription);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), ingredientDescriptionController.deleteIngredientDescription);

module.exports = router;