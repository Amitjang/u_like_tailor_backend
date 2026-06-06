
const Customer = require("../models/customer.model");
const Order = require("../models/order.model");
const cloudinary = require("../config/cloudinary");
// GET ALL CUSTOMERS

const getCustomers = async (req, res) => {
  try {
    const { userId, tag, q } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const filter = {
      userId,
    };

    if (tag) {
      filter.tag = tag;
    }

    if (q) {
      const search = new RegExp(q, "i");

      filter.$or = [
        { name: search },
        { nameHi: search },
        { phone: search },
      ];
    }

    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      total: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error(error);

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
    const { userId } = req.query;

    const customer = await Customer.findOne({
      _id: customerId,
      userId,
    }).lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customerOrders = await Order.find({
      customerId: customer._id.toString(),
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
    console.error(error);

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
      userId,
      name,
      phone,
      address,
      nameHi,
      tag,
      notes,
      notesHi,
      lastOrderType,
      lastOrderTypeHi,
      semanticLabel,
      avatarColor,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "name, phone and address are required",
      });
    }

    // Check duplicate customer for same user only
    const existingCustomer = await Customer.findOne({
      userId,
      phone,
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists with this phone",
      });
    }

    const imageUrl = req.file?.path || "";

    const measurements = {
      shoulder:
        req.body.measurements?.shoulder ||
        req.body["measurements[shoulder]"] ||
        "",

      chest:
        req.body.measurements?.chest ||
        req.body["measurements[chest]"] ||
        "",

      waist:
        req.body.measurements?.waist ||
        req.body["measurements[waist]"] ||
        "",

      hip:
        req.body.measurements?.hip ||
        req.body["measurements[hip]"] ||
        "",

      height:
        req.body.measurements?.height ||
        req.body["measurements[height]"] ||
        "",

      sleeve:
        req.body.measurements?.sleeve ||
        req.body["measurements[sleeve]"] ||
        "",

      kurtiLength:
        req.body.measurements?.kurtiLength ||
        req.body["measurements[kurtiLength]"] ||
        "",

      trouserLength:
        req.body.measurements?.trouserLength ||
        req.body["measurements[trouserLength]"] ||
        "",

      neckSize:
        req.body.measurements?.neckSize ||
        req.body["measurements[neckSize]"] ||
        "",
    };

    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    const customer = await Customer.create({
      userId,
      name,
      phone,
      address,

      nameHi: nameHi || "",
      tag: tag || "regular",
      notes: notes || "",
      notesHi: notesHi || "",
      lastOrderType: lastOrderType || "",
      lastOrderTypeHi: lastOrderTypeHi || "",
      semanticLabel: semanticLabel || "",
      avatarColor: avatarColor || "#7B1FA2",

      initials,
      measurements,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Create Customer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create customer",
      error: error.message,
    });
  }
};
// const createCustomer = async (req, res) => {

//   try {

//     const {
//       id,
//       name,
//       nameHi,
//       phone,
//       address,
//       tag,
//       notes,
//       notesHi,
//       lastOrderType,
//       lastOrderTypeHi,
//       semanticLabel,
//       avatarColor,
//       measurements,
//     } = req.body;
//     console.log("Received data:", req.body);
//     process.stdout.write("Received file: ");
//     console.log(req.file);

//     if (!name || !phone || !address) {
//       return res.status(400).json({
//         success: false,
//         message: "recived data "+req.body.name+" name, phone, address are required",
//         //  "name, phone, address are required",
//       });
//     }

//     const existingCustomer = await Customer.findOne({ phone });

//     if (existingCustomer) {

//       return res.status(409).json({
//         success: false,
//         message: "Customer already exists with this phone",
//       });
//     }

//     // AUTO INITIALS
//     const initials = name
//       .split(" ")
//       .map((e) => e[0])
//       .join("")
//       .toUpperCase();

//     const customer = await Customer.create({

//       name,

//       nameHi: nameHi || "",

//       phone,

//       address,

//       tag: tag || "regular",

//       totalOrders: 0,

//       lastOrderType: lastOrderType || "",

//       lastOrderTypeHi: lastOrderTypeHi || "",

//       notes: notes || "",

//       notesHi: notesHi || "",

//       avatarColor: avatarColor || "#7B1FA2",

//       initials,

//       measurements: measurements || {},

//       // PERMANENT CLOUDINARY URL
//       imageUrl: req.file?.path || "",

//       semanticLabel: semanticLabel || "",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Customer created successfully",
//       data: customer,
//     });

//   } catch (error) {

//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to create customer",
//       error: error.message,
//     });
//   }
// };

// UPDATE CUSTOMER
const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const updates = {};

    const fields = [
      "name",
      "nameHi",
      "phone",
      "address",
      "tag",
      "notes",
      "notesHi",
      "lastOrderType",
      "lastOrderTypeHi",
      "semanticLabel",
      "avatarColor",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update initials if name changes
    if (req.body.name) {
      updates.initials = req.body.name
        .split(" ")
        .map((e) => e[0])
        .join("")
        .toUpperCase();
    }

    // Measurements
    updates.measurements = {
      shoulder:
        req.body.measurements?.shoulder ||
        req.body["measurements[shoulder]"],

      chest:
        req.body.measurements?.chest ||
        req.body["measurements[chest]"],

      waist:
        req.body.measurements?.waist ||
        req.body["measurements[waist]"],

      hip:
        req.body.measurements?.hip ||
        req.body["measurements[hip]"],

      height:
        req.body.measurements?.height ||
        req.body["measurements[height]"],

      sleeve:
        req.body.measurements?.sleeve ||
        req.body["measurements[sleeve]"],

      kurtiLength:
        req.body.measurements?.kurtiLength ||
        req.body["measurements[kurtiLength]"],

      trouserLength:
        req.body.measurements?.trouserLength ||
        req.body["measurements[trouserLength]"],

      neckSize:
        req.body.measurements?.neckSize ||
        req.body["measurements[neckSize]"],
    };

    Object.keys(updates.measurements).forEach((key) => {
      if (
        updates.measurements[key] === undefined ||
        updates.measurements[key] === null
      ) {
        delete updates.measurements[key];
      }
    });

    // Image update
    if (req.file?.path) {
      updates.imageUrl = req.file.path;
    }

    const customer = await Customer.findOneAndUpdate(
      {
        _id: customerId,
        userId: userId,
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error(error);

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
    const { userId, measurements } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!measurements) {
      return res.status(400).json({
        success: false,
        message: "Measurements are required",
      });
    }

    const customer = await Customer.findOneAndUpdate(
      {
        _id: customerId,
        userId: userId,
      },
      {
        $set: {
          measurements,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Measurements updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error(error);

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
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const deletedCustomer = await Customer.findOneAndDelete({
      _id: customerId,
      userId: userId,
    });

    if (!deletedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      data: deletedCustomer,
    });
  } catch (error) {
    console.error(error);

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
// const Customer = require("../models/customer.model");
// const Order = require("../models/order.model");

// // GET ALL CUSTOMERS
// const getCustomers = async (req, res) => {
//   try {
//     const { tag, q } = req.query;

//     const filter = {};

//     if (tag) {
//       filter.tag = tag;
//     }

//     if (q) {
//       const search = new RegExp(q, "i");

//       filter.$or = [
//         { name: search },
//         { phone: search }
//       ];
//     }

//     const customers = await Customer.find(filter).lean();

//     return res.status(200).json({
//       success: true,
//       message: "Customers fetched successfully",
//       data: customers,
//     });

//   } catch (error) {

//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to fetch customers",
//       error: error.message,
//     });
//   }
// };

// // GET SINGLE CUSTOMER
// const getCustomerById = async (req, res) => {

//   try {

//     const { customerId } = req.params;

//     const customer = await Customer.findById(customerId).lean();

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     const customerOrders = await Order.find({
//       $or: [
//         { customerId: customer._id.toString() },
//         { phone: customer.phone },
//       ],
//     }).lean();

//     return res.status(200).json({
//       success: true,
//       message: "Customer fetched successfully",
//       data: {
//         ...customer,
//         totalOrders: customerOrders.length,
//         orders: customerOrders,
//       },
//     });

//   } catch (error) {

//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to fetch customer",
//       error: error.message,
//     });
//   }
// };

// // CREATE CUSTOMER
// const createCustomer = async (req, res) => {

//   try {

//     const {
//       name,
//       phone,
//       address,
//       tag,
//       notes,
//       measurements,
//     } = req.body;

//     if (!name || !phone || !address) {

//       return res.status(400).json({
//         success: false,
//         message: "name, phone, address are required",
//       });
//     }

//     const existingCustomer = await Customer.findOne({ phone });

//     if (existingCustomer) {

//       return res.status(409).json({
//         success: false,
//         message: "Customer already exists with this phone",
//       });
//     }

//     const customer = await Customer.create({
//       name,
//       phone,
//       address,
//       tag: tag || "regular",
//       notes: notes || "",
//       measurements: measurements || {},
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Customer created successfully",
//       data: customer,
//     });

//   } catch (error) {

//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to create customer",
//       error: error.message,
//     });
//   }
// };

// // UPDATE CUSTOMER
// const updateCustomer = async (req, res) => {

//   try {

//     const { customerId } = req.params;

//     const updates = {};

//     const fields = [
//       "name",
//       "phone",
//       "address",
//       "tag",
//       "notes",
//     ];

//     fields.forEach((field) => {

//       if (req.body[field] !== undefined) {
//         updates[field] = req.body[field];
//       }

//     });

//     const customer = await Customer.findByIdAndUpdate(
//       customerId,
//       updates,
//       { new: true }
//     );

//     if (!customer) {

//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Customer updated successfully",
//       data: customer,
//     });

//   } catch (error) {

//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to update customer",
//       error: error.message,
//     });
//   }
// };

// // UPDATE MEASUREMENTS
// const updateMeasurements = async (req, res) => {

//   try {

//     const { customerId } = req.params;

//     const customer = await Customer.findByIdAndUpdate(
//       customerId,
//       {
//         measurements: req.body.measurements || {},
//       },
//       { new: true }
//     );

//     if (!customer) {

//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Measurements updated successfully",
//       data: customer,
//     });

//   } catch (error) {

//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to update measurements",
//       error: error.message,
//     });
//   }
// };

// // DELETE CUSTOMER
// const deleteCustomer = async (req, res) => {

//   try {

//     const { customerId } = req.params;

//     const deletedCustomer = await Customer.findByIdAndDelete(customerId);

//     if (!deletedCustomer) {

//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Customer deleted successfully",
//       data: deletedCustomer,
//     });

//   } catch (error) {

//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to delete customer",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   getCustomers,
//   getCustomerById,
//   createCustomer,
//   updateCustomer,
//   updateMeasurements,
//   deleteCustomer,
// };