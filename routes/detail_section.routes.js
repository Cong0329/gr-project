const express = require('express');
const router = express.Router();
const detailSectionController = require('../controllers/product_section.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/:product_detail_id', authenticateToken, requireRole('ROLE_ADMIN'), upload.single('image'), detailSectionController.createSection);
router.post('/:product_detail_id/full', authenticateToken, requireRole('ROLE_ADMIN'), detailSectionController.createFullSection);
router.patch('/:product_detail_id', authenticateToken, requireRole('ROLE_ADMIN'), detailSectionController.updateSection);   
router.delete('/:product_detail_id', authenticateToken, requireRole('ROLE_ADMIN'), detailSectionController.deleteSection);

module.exports = router;