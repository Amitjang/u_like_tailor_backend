const express = require("express");
const { orders, services, workers, customers } = require("../data/store");
const { makeId, normalizeStatus } = require("../utils/helpers");

const router = express.Router();

router.get("/", (req, res) => {
  const { status, phone, q } = req.query;
  const filtered = orders.filter((item) => {
    const statusMatch = !status || item.status === status;
    const phoneMatch = !phone || item.phone === phone;
    const qMatch =
      !q ||
      item.id.toLowerCase().includes(String(q).toLowerCase()) ||
      item.customerName.toLowerCase().includes(String(q).toLowerCase());
    return statusMatch && phoneMatch && qMatch;
  });

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: filtered
  });
});

router.get("/:orderId", (req, res) => {
  const order = orders.find((item) => item.id === req.params.orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  return res.status(200).json({ success: true, message: "Order fetched successfully", data: order });
});

router.post("/", (req, res) => {
  const {
    customerId,
    customerName,
    phone,
    serviceId,
    deadline,
    totalAmount,
    paidAmount,
    measurements,
    address
  } = req.body;

  if (!customerName || !phone || !serviceId || !deadline || !address) {
    return res.status(400).json({ success: false, message: "customerName, phone, serviceId, deadline, address are required" });
  }

  const service = services.find((item) => item.id === serviceId);
  if (!service) return res.status(404).json({ success: false, message: "Service not found" });

  const order = {
    id: makeId("ORD"),
    customerId: customerId || "",
    customerName,
    phone,
    serviceId,
    dressType: service.name,
    status: "pending",
    deadline,
    totalAmount: typeof totalAmount === "number" ? totalAmount : service.price,
    paidAmount: typeof paidAmount === "number" ? paidAmount : 0,
    workerId: null,
    measurements: measurements || {},
    address,
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  const customer = customers.find((item) => item.id === customerId || item.phone === phone);
  if (customer) {
    customer.name = customerName;
    customer.phone = phone;
    customer.address = address;
    customer.measurements = measurements || customer.measurements || {};
  }

  return res.status(201).json({ success: true, message: "Order created successfully", data: order });
});

router.patch("/:orderId", (req, res) => {
  const order = orders.find((item) => item.id === req.params.orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  const { deadline, totalAmount, paidAmount, address, measurements } = req.body;
  if (deadline) order.deadline = deadline;
  if (typeof totalAmount === "number") order.totalAmount = totalAmount;
  if (typeof paidAmount === "number") order.paidAmount = paidAmount;
  if (address) order.address = address;
  if (measurements) order.measurements = measurements;

  return res.status(200).json({ success: true, message: "Order updated successfully", data: order });
});

router.patch("/:orderId/status", (req, res) => {
  const order = orders.find((item) => item.id === req.params.orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  const normalized = normalizeStatus(req.body.status);
  if (!normalized) {
    return res.status(400).json({ success: false, message: "Invalid status. Use pending/stitching/trial/alteration/ready/delivered" });
  }

  order.status = normalized;
  return res.status(200).json({ success: true, message: "Order status updated successfully", data: order });
});

router.patch("/:orderId/assign-worker", (req, res) => {
  const order = orders.find((item) => item.id === req.params.orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  const worker = workers.find((item) => item.id === req.body.workerId);
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });

  workers.forEach((item) => {
    item.assignedOrderIds = item.assignedOrderIds.filter((id) => id !== order.id);
    if (item.assignedOrderIds.length === 0) item.status = "free";
  });

  worker.assignedOrderIds.push(order.id);
  worker.status = "active";
  order.workerId = worker.id;

  return res.status(200).json({
    success: true,
    message: "Worker assigned successfully",
    data: { orderId: order.id, workerId: worker.id }
  });
});

router.delete("/:orderId", (req, res) => {
  const index = orders.findIndex((item) => item.id === req.params.orderId);
  if (index === -1) return res.status(404).json({ success: false, message: "Order not found" });

  const deleted = orders.splice(index, 1)[0];
  workers.forEach((item) => {
    item.assignedOrderIds = item.assignedOrderIds.filter((id) => id !== deleted.id);
    if (item.assignedOrderIds.length === 0) item.status = "free";
  });

  return res.status(200).json({
    success: true,
    message: "Order deleted successfully",
    data: deleted
  });
});

module.exports = router;
