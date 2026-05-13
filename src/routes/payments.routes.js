const express = require("express");
const { payments, orders, customers } = require("../data/store");
const { makeId, orderDueAmount } = require("../utils/helpers");

const router = express.Router();

router.get("/transactions", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Payment transactions fetched successfully",
    data: payments
  });
});

router.get("/dues", (_req, res) => {
  const dues = orders
    .map((order) => {
      const dueAmount = orderDueAmount(order);
      const customer = customers.find((item) => item.id === order.customerId || item.phone === order.phone);
      return {
        orderId: order.id,
        customerId: order.customerId,
        customerName: customer ? customer.name : order.customerName,
        amountDue: dueAmount,
        status: order.status
      };
    })
    .filter((item) => item.amountDue > 0);

  return res.status(200).json({ success: true, message: "Due payments fetched successfully", data: dues });
});

router.post("/receive", (req, res) => {
  const { orderId, amount, mode, note } = req.body;
  if (!orderId || typeof amount !== "number" || amount <= 0 || !mode) {
    return res.status(400).json({ success: false, message: "orderId, positive amount and mode are required" });
  }

  const order = orders.find((item) => item.id === orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  const due = orderDueAmount(order);
  if (amount > due) {
    return res.status(400).json({ success: false, message: `Amount cannot be greater than due amount (${due})` });
  }

  order.paidAmount += amount;
  const payment = {
    id: makeId("PAY"),
    orderId: order.id,
    customerId: order.customerId,
    amount,
    mode,
    note: note || "",
    createdAt: new Date().toISOString()
  };
  payments.unshift(payment);

  return res.status(201).json({
    success: true,
    message: "Payment recorded successfully",
    data: { payment, orderPaidAmount: order.paidAmount, orderDueAmount: orderDueAmount(order) }
  });
});

router.get("/summary/today", (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const todayPayments = payments.filter((item) => item.createdAt.startsWith(today));
  const receivedToday = todayPayments.reduce((sum, item) => sum + item.amount, 0);
  const cashAmount = todayPayments.filter((i) => i.mode === "Cash").reduce((sum, i) => sum + i.amount, 0);
  const upiAmount = todayPayments.filter((i) => i.mode === "UPI").reduce((sum, i) => sum + i.amount, 0);
  const partialAmount = todayPayments.filter((i) => i.mode === "Partial").reduce((sum, i) => sum + i.amount, 0);
  const totalUdhaar = orders.reduce((sum, item) => sum + orderDueAmount(item), 0);

  return res.status(200).json({
    success: true,
    message: "Today payment summary fetched successfully",
    data: { receivedToday, totalUdhaar, cashAmount, upiAmount, partialAmount }
  });
});

module.exports = router;
