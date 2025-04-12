const express = require("express");
const router = express.Router();
const { Doctor } = require("../models");

router.post("/", async (req, res) => {
  try {
    const newDoctor = await Doctor.create(req.body);
    res.status(201).json(newDoctor);
  } catch (err) {
    console.error("Lỗi khi tạo bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server khi tạo bác sĩ" });
  }
});

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách bác sĩ" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ error: "Không tìm thấy bác sĩ" });
    res.json(doctor);
  } catch (err) {
    console.error("Lỗi khi lấy bác sĩ theo ID:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ error: "Không tìm thấy bác sĩ" });

    await doctor.update(req.body);
    res.json(doctor);
  } catch (err) {
    console.error("Lỗi khi cập nhật bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ error: "Không tìm thấy bác sĩ" });

    await doctor.destroy();
    res.json({ message: "Xoá bác sĩ thành công" });
  } catch (err) {
    console.error("Lỗi khi xoá bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
