const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
const {authenticateToken} = require("../middlewares/auth.middleware");
const requireRole = require('../middlewares/role.middleware');

// Add new Address
router.post("/", authenticateToken, addressController.createAddress);
// Get Address by User
router.get("/", authenticateToken, addressController.getAddressesByUser);
// Get All Address
router.get("/all", authenticateToken, requireRole('ROLE_ADMIN'), addressController.getAllAddresses);

router.get("/:id", authenticateToken, addressController.getAddressById);
// Update Address
router.put("/:id", authenticateToken, addressController.updateAddress);
// Delete Address
router.delete("/:id", authenticateToken, addressController.deleteAddress);

module.exports = router;
