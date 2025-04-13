const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), countryController.createCountry);
router.get('/', countryController.getAllCountries);
router.put('/:id', authenticateToken, requireRole('ROLE_ADMIN'), countryController.updateCountry);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), countryController.deleteCountry);

module.exports = router;