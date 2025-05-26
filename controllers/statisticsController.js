const { Order } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

exports.getRevenue = async (req, res) => {
  try {
    const { start_date, end_date, group_by } = req.query;

    if (!start_date || !end_date || !group_by) {
      return res.status(400).json({ message: "start_date, end_date, and group_by are required" });
    }

    let dateFormat;
    switch (group_by) {
      case "day":
        dateFormat = "%Y-%m-%d";
        break;
      case "month":
        dateFormat = "%Y-%m";
        break;
      case "year":
        dateFormat = "%Y";
        break;
      default:
        return res.status(400).json({ message: "Invalid group_by. Use day, month, or year." });
    }

    const revenue = await Order.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("createdAt"), dateFormat), "period"],
        [fn("SUM", col("total_price")), "total_revenue"],
        [fn("SUM", col("discout_price")), "discount_total"]
      ],
      where: {
        status: "completed",
        createdAt: {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        },
      },
      group: [literal(`DATE_FORMAT(createdAt, '${dateFormat}')`)],
      order: [[literal("period"), "ASC"]],
      raw: true,
    });

    return res.status(200).json(revenue);
  } catch (error) {
    console.error("Revenue Statistics Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
