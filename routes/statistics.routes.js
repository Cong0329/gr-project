const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");

router.get("/revenue", statisticsController.getRevenue);

module.exports = router;
