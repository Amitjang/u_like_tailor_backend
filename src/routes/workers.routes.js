const express = require("express");
const { workers, orders } = require("../data/store");
const { makeId } = require("../utils/helpers");

const router = express.Router();

router.get("/", (_req, res) => {
  const data = workers.map((worker) => {
    const assignedOrders = orders.filter((item) => worker.assignedOrderIds.includes(item.id));
    return { ...worker, assignedOrders };
  });
  return res.status(200).json({ success: true, message: "Workers fetched successfully", data });
});

router.get("/summary/cards", (_req, res) => {
  const activeWorkers = workers.filter((item) => item.status === "active").length;
  const freeWorkers = workers.filter((item) => item.status === "free").length;
  const totalOrders = workers.reduce((sum, item) => sum + item.assignedOrderIds.length, 0);
  return res.status(200).json({
    success: true,
    message: "Worker summary fetched successfully",
    data: { activeWorkers, freeWorkers, totalOrders }
  });
});

router.post("/", (req, res) => {
  const { name, phone, specialization } = req.body;
  if (!name || !phone || !specialization) {
    return res.status(400).json({ success: false, message: "name, phone, specialization are required" });
  }

  const worker = {
    id: makeId("W"),
    name,
    phone,
    specialization,
    status: "free",
    assignedOrderIds: []
  };
  workers.push(worker);
  return res.status(201).json({ success: true, message: "Worker created successfully", data: worker });
});

router.patch("/:workerId", (req, res) => {
  const worker = workers.find((item) => item.id === req.params.workerId);
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });

  const { name, phone, specialization, status } = req.body;
  if (name) worker.name = name;
  if (phone) worker.phone = phone;
  if (specialization) worker.specialization = specialization;
  if (status) worker.status = status;

  return res.status(200).json({ success: true, message: "Worker updated successfully", data: worker });
});

router.patch("/:workerId/toggle-status", (req, res) => {
  const worker = workers.find((item) => item.id === req.params.workerId);
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });

  worker.status = worker.status === "active" ? "free" : "active";
  return res.status(200).json({ success: true, message: "Worker status toggled successfully", data: worker });
});

router.delete("/:workerId", (req, res) => {
  const index = workers.findIndex((item) => item.id === req.params.workerId);
  if (index === -1) return res.status(404).json({ success: false, message: "Worker not found" });

  const worker = workers[index];
  if (worker.assignedOrderIds.length > 0) {
    return res.status(400).json({ success: false, message: "Cannot delete worker with assigned orders" });
  }

  const deleted = workers.splice(index, 1)[0];
  return res.status(200).json({ success: true, message: "Worker deleted successfully", data: deleted });
});

module.exports = router;
