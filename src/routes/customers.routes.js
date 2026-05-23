const express = require("express");

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  updateMeasurements,
  deleteCustomer,
} = require("../controller/customer.controller");

const upload = require("../config/mutler");

const router = express.Router();

router.get("/getCustomers", getCustomers);

router.get("/getCustomerById/:customerId", getCustomerById);

// FIXED
router.post(
  "/createCustomer",
  upload.single("image"),
  createCustomer
);

// FIXED
router.patch(
  "/updateCustomer/:customerId",
  upload.single("image"),
  updateCustomer
);

router.put("/updateMeasurements/:customerId", updateMeasurements);

router.delete("/deleteCustomer/:customerId", deleteCustomer);

module.exports = router;