const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const {authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');



// POST /doctors - Tạo mới doctor
router.post("/", doctorController.createDoctor);

// GET /doctors - Lấy tất cả doctors
router.get("/", doctorController.getAllDoctors);

// GET /doctors/:id - Lấy thông tin chi tiết doctor
router.get("/:id", doctorController.getDoctorById);

// PUT /doctors/:id - Cập nhật thông tin doctor
router.put("/:id", doctorController.updateDoctor);

// DELETE /doctors/:id - Xóa doctor
router.delete("/:id", doctorController.deleteDoctor);

router.get("/info/me", authenticateAdminToken, requireRole('ROLE_DOCTOR', 'ROLE_ADMIN'), doctorController.getDoctorInfo);


module.exports = router;