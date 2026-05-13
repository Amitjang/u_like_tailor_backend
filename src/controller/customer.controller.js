const Customer = require("../models/customer.model");
const Order = require("../models/order.model");

// GET ALL CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const { tag, q } = req.query;

    const filter = {};

    if (tag) {
      filter.tag = tag;
    }

    if (q) {
      const search = new RegExp(q, "i");

      filter.$or = [
        { name: search },
        { phone: search }
      ];
    }

    const customers = await Customer.find(filter).lean();

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      data: customers,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch customers",
      error: error.message,
    });
  }
};

// GET SINGLE CUSTOMER
const getCustomerById = async (req, res) => {

  try {

    const { customerId } = req.params;

    const customer = await Customer.findById(customerId).lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customerOrders = await Order.find({
      $or: [
        { customerId: customer._id.toString() },
        { phone: customer.phone },
      ],
    }).lean();

    return res.status(200).json({
      success: true,
      message: "Customer fetched successfully",
      data: {
        ...customer,
        totalOrders: customerOrders.length,
        orders: customerOrders,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch customer",
      error: error.message,
    });
  }
};

// CREATE CUSTOMER
const createCustomer = async (req, res) => {

  try {

    const {
      name,
      phone,
      address,
      tag,
      notes,
      measurements,
    } = req.body;

    if (!name || !phone || !address) {

      return res.status(400).json({
        success: false,
        message: "name, phone, address are required",
      });
    }

    const existingCustomer = await Customer.findOne({ phone });

    if (existingCustomer) {

      return res.status(409).json({
        success: false,
        message: "Customer already exists with this phone",
      });
    }

    const customer = await Customer.create({
      name,
      phone,
      address,
      tag: tag || "regular",
      notes: notes || "",
      measurements: measurements || {},
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to create customer",
      error: error.message,
    });
  }
};

// UPDATE CUSTOMER
const updateCustomer = async (req, res) => {

  try {

    const { customerId } = req.params;

    const updates = {};

    const fields = [
      "name",
      "phone",
      "address",
      "tag",
      "notes",
    ];

    fields.forEach((field) => {

      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }

    });

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      updates,
      { new: true }
    );

    if (!customer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to update customer",
      error: error.message,
    });
  }
};

// UPDATE MEASUREMENTS
const updateMeasurements = async (req, res) => {

  try {

    const { customerId } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        measurements: req.body.measurements || {},
      },
      { new: true }
    );

    if (!customer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Measurements updated successfully",
      data: customer,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to update measurements",
      error: error.message,
    });
  }
};

// DELETE CUSTOMER
const deleteCustomer = async (req, res) => {

  try {

    const { customerId } = req.params;

    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      data: deletedCustomer,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete customer",
      error: error.message,
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  updateMeasurements,
  deleteCustomer,
};