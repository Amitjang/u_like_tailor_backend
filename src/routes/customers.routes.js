const express = require("express");

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  updateMeasurements,
  deleteCustomer,
} = require("../controller/customer.controller");

const router = express.Router();

router.get("/", getCustomers);

router.get("/:customerId", getCustomerById);

router.post("/", createCustomer);

router.patch("/:customerId", updateCustomer);

router.put("/:customerId/measurements", updateMeasurements);

router.delete("/:customerId", deleteCustomer);

module.exports = router;