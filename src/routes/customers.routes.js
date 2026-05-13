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

router.get("/getCustomers", getCustomers);

router.get("/getCustomerById/:customerId", getCustomerById);

router.post("/createCustomer", createCustomer);

router.patch("/updateCustomer/:customerId", updateCustomer);

router.put("/updateMeasurements/:customerId", updateMeasurements);

router.delete("/deleteCustomer/:customerId", deleteCustomer);

module.exports = router;