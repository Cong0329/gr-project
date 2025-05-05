const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const {authenticateAdminToken} = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const requireRole = require('../middlewares/role.middleware');



router.get('/', brandController.getAllBrands);
router.get('/:name', brandController.getProductsByBrandName);
router.get('/:country', brandController.getProductsByBrandCountry);
router.get('/:origin', brandController.getProductsByBrandOriginal);
router.post('/', authenticateAdminToken, requireRole('ROLE_ADMIN'),upload.single('logo'), brandController.createBrand);
router.put('/:id', authenticateAdminToken,requireRole('ROLE_ADMIN'), upload.single('logo'), brandController.updateBrand);
router.delete('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), brandController.deleteBrand);

module.exports = router;
