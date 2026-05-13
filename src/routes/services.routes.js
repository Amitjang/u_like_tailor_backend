const express = require("express");
const { services } = require("../data/store");
const { makeId } = require("../utils/helpers");

const router = express.Router();

router.get("/", (req, res) => {
  const { category, q } = req.query;
  const filtered = services.filter((item) => {
    const categoryMatch = !category || item.category.toLowerCase() === String(category).toLowerCase();
    const searchMatch = !q || item.name.toLowerCase().includes(String(q).toLowerCase());
    return categoryMatch && searchMatch;
  });

  return res.status(200).json({
    success: true,
    message: "Services fetched successfully",
    data: filtered
  });
});

router.get("/:serviceId", (req, res) => {
  const service = services.find((item) => item.id === req.params.serviceId);
  if (!service) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }
  return res.status(200).json({ success: true, message: "Service fetched successfully", data: service });
});

router.post("/", (req, res) => {
  const { name, category, price, deliveryDays } = req.body;
  if (!name || !category || typeof price !== "number" || typeof deliveryDays !== "number") {
    return res.status(400).json({ success: false, message: "name, category, price, deliveryDays are required" });
  }

  const service = { id: makeId("SRV"), name, category, price, deliveryDays };
  services.push(service);
  return res.status(201).json({ success: true, message: "Service created successfully", data: service });
});

router.patch("/:serviceId", (req, res) => {
  const service = services.find((item) => item.id === req.params.serviceId);
  if (!service) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  const { name, category, price, deliveryDays } = req.body;
  if (name) service.name = name;
  if (category) service.category = category;
  if (typeof price === "number") service.price = price;
  if (typeof deliveryDays === "number") service.deliveryDays = deliveryDays;

  return res.status(200).json({ success: true, message: "Service updated successfully", data: service });
});

router.delete("/:serviceId", (req, res) => {
  const index = services.findIndex((item) => item.id === req.params.serviceId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  const deleted = services.splice(index, 1)[0];
  return res.status(200).json({ success: true, message: "Service deleted successfully", data: deleted });
});

module.exports = router;
