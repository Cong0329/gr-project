const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const requireRole = require('../middlewares/role.middleware');



router.get('/', brandController.getAllBrands);
router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), upload.single('logo'), brandController.createBrand);
router.put('/:id', authenticateToken,requireRole('ROLE_ADMIN'), upload.single('logo'), brandController.updateBrand);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), brandController.deleteBrand);

module.exports = router;
