const express = require('express');
const router = express.Router();
const detailSectionController = require('../controllers/product_section.controller');
const {authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/:product_detail_id', authenticateAdminToken, requireRole('ROLE_ADMIN'), upload.single('image'), detailSectionController.createSection);
router.post('/:product_detail_id/full', authenticateAdminToken, requireRole('ROLE_ADMIN'), detailSectionController.createFullSection);
router.post('/:section_id/description', authenticateAdminToken, requireRole('ROLE_ADMIN'), detailSectionController.addDescription);
router.post('/:section_id/ingredient', authenticateAdminToken, requireRole('ROLE_ADMIN'), detailSectionController.addIngredient);
router.patch('/:section_id', authenticateAdminToken, requireRole('ROLE_ADMIN'),upload.single('image'), detailSectionController.updateSection);   
router.delete('/:section_id', authenticateAdminToken, requireRole('ROLE_ADMIN'), detailSectionController.deleteSection);
router.delete('/:id/description', authenticateAdminToken, requireRole('ROLE_ADMIN'), detailSectionController.deleteDescription);
router.delete('/:id/ingredient', authenticateAdminToken, requireRole('ROLE_ADMIN'), detailSectionController.deleteIngredient);

module.exports = router;