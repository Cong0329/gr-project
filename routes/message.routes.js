const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const {authenticateToken, authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');



router.post('/user', authenticateToken,upload.single('image'), messageController.sendMessage);
router.post('/ai/user', authenticateToken,upload.single('image'), messageController.sendAIMessage);
router.post('/admin', authenticateAdminToken,upload.single('image'), requireRole('ROLE_ADMIN'), messageController.sendMessage);
router.get('/all', authenticateAdminToken, requireRole('ROLE_ADMIN'), messageController.getAllMessages);
router.get('/:id/user', authenticateToken, messageController.getMessageItems);
router.get('/:id/admin', authenticateAdminToken, requireRole('ROLE_ADMIN'), messageController.getAdminMessageItems);
router.patch('/hidden/:id/admin/', authenticateAdminToken, requireRole('ROLE_ADMIN'), messageController.hideMessage);
router.patch('/unlock/:id/admin/', authenticateAdminToken, requireRole('ROLE_ADMIN'), messageController.unlockMessage);



module.exports = router;