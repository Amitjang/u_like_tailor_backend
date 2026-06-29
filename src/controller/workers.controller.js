const Worker = require("../models/worker.model");
const Order = require("../models/order.model");
const { makeId } = require("../utils/helpers");


/// GET ALL WORKERS
const getWorkers = async (_req, res) => {
  try {
    const workers = await Worker.find()
      .sort({ createdAt: -1 });

    const data = workers.map((worker) => ({
      ...worker.toObject(),
      assignedOrders: worker.assignedOrderIds,
    }));

    return res.status(200).json({
      success: true,
      message: "Workers fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// GET SINGLE WORKER
const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.workerId)
      .populate("assignedOrderIds");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Worker fetched successfully",
      data: {
        ...worker.toObject(),
        assignedOrders: worker.assignedOrderIds,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// WORKER SUMMARY
const getWorkerSummary = async (_req, res) => {
  try {
    const activeWorkers = await Worker.countDocuments({
      status: "active",
    });

    const freeWorkers = await Worker.countDocuments({
      status: "free",
    });

    const workers = await Worker.find();

    const totalOrders = workers.reduce(
      (sum, worker) => sum + worker.assignedOrderIds.length,
      0
    );

    return res.status(200).json({
      success: true,
      message: "Worker summary fetched successfully",
      data: {
        activeWorkers,
        freeWorkers,
        totalWorkers: activeWorkers + freeWorkers,
        totalOrders,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// CREATE WORKER
const createWorker = async (req, res) => {
  try {
    const {
      name,
      nameHi,
      phone,
      specialization,
      specializationHi,
      avatarColor,
    } = req.body;

    if (!name || !phone || !specialization) {
      return res.status(400).json({
        success: false,
        message: "name, phone and specialization are required",
      });
    }

    const exists = await Worker.findOne({ phone });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Worker already exists with this phone number",
      });
    }

    const photo = req.file
      ? req.file.path || req.file.location || req.file.secure_url
      : "";

    const worker = await Worker.create({
      workerId: makeId("W"),
      name,
      nameHi,
      phone,
      specialization,
      specializationHi,
      avatarColor: avatarColor || "#1565C0",
      photo,
      initials: name
        .trim()
        .split(" ")
        .map((item) => item[0])
        .join("")
        .toUpperCase(),
      status: "free",
      assignedOrderIds: [],
    });

    return res.status(201).json({
      success: true,
      message: "Worker created successfully",
      data: worker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// UPDATE WORKER
const updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.workerId);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    const {
      name,
      nameHi,
      phone,
      specialization,
      specializationHi,
      avatarColor,
      status,
    } = req.body;

    if (name) {
      worker.name = name;
      worker.initials = name
        .trim()
        .split(" ")
        .map((item) => item[0])
        .join("")
        .toUpperCase();
    }

    if (nameHi) worker.nameHi = nameHi;
    if (phone) worker.phone = phone;
    if (specialization) worker.specialization = specialization;
    if (specializationHi) worker.specializationHi = specializationHi;
    if (avatarColor) worker.avatarColor = avatarColor;
    if (status) worker.status = status;

    // Update photo if uploaded
    if (req.file) {
      worker.photo =
        req.file.path ||
        req.file.location ||
        req.file.secure_url;
    }

    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Worker updated successfully",
      data: worker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// ASSIGN ORDER TO WORKER
const assignOrderToWorker = async (req, res) => {
  try {
    const { workerId, orderId } = req.body;

    const worker = await Worker.findById(workerId);
    const order = await Order.findById(orderId);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!worker.assignedOrderIds.includes(orderId)) {
      worker.assignedOrderIds.push(orderId);
    }

    worker.status = "active";

    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Order assigned successfully",
      data: worker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// REMOVE ORDER FROM WORKER
const removeOrderFromWorker = async (req, res) => {
  try {
    const { workerId, orderId } = req.body;

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    worker.assignedOrderIds = worker.assignedOrderIds.filter(
      (id) => id.toString() !== orderId
    );

    if (worker.assignedOrderIds.length === 0) {
      worker.status = "free";
    }

    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Order removed successfully",
      data: worker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// TOGGLE STATUS
const toggleWorkerStatus = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.workerId);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    worker.status =
      worker.status === "active" ? "free" : "active";

    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Worker status updated successfully",
      data: worker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// DELETE WORKER
const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.workerId);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    if (worker.assignedOrderIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete worker with assigned orders",
      });
    }

    await Worker.findByIdAndDelete(req.params.workerId);

    return res.status(200).json({
      success: true,
      message: "Worker deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWorkers,
  getWorkerById,
  getWorkerSummary,
  createWorker,
  updateWorker,
  assignOrderToWorker,
  removeOrderFromWorker,
  toggleWorkerStatus,
  deleteWorker,
};