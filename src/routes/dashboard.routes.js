const express = require("express");
const { orders, customers, workers } = require("../data/store");
const { orderDueAmount } = require("../utils/helpers");

const router = express.Router();

router.get("/kpis", (_req, res) => {
  const totalOrders = orders.length;
  const pending = orders.filter((item) => item.status === "pending").length;
  const ready = orders.filter((item) => item.status === "ready").length;
  const activeWorkers = workers.filter((item) => item.status === "active").length;
  const totalDue = orders.reduce((sum, item) => sum + orderDueAmount(item), 0);

  return res.status(200).json({
    success: true,
    message: "Dashboard KPIs fetched successfully",
    data: {
      totalOrders,
      pendingOrders: pending,
      readyOrders: ready,
      totalCustomers: customers.length,
      activeWorkers,
      totalDue
    }
  });
});

module.exports = router;
