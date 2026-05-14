const Worker = require("../models/worker.model");
const Order = require("../models/order.model"); // if you have order model
const { makeId } = require("../utils/helpers");

/// GET ALL WORKERS
const getWorkers = async (_req, res) => {
  try {
    const workers = await Worker.find();

    const data = await Promise.all(
      workers.map(async (worker) => {
        const assignedOrders = await Order.find({
          _id: { $in: worker.assignedOrderIds },
        });

        return {
          ...worker._doc,
          assignedOrders,
        };
      })
    );

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

/// SUMMARY
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
      (sum, item) => sum + item.assignedOrderIds.length,
      0
    );

    return res.status(200).json({
      success: true,
      message: "Worker summary fetched successfully",
      data: {
        activeWorkers,
        freeWorkers,
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
    const { name, phone, specialization } = req.body;

    if (!name || !phone || !specialization) {
      return res.status(400).json({
        success: false,
        message: "name, phone, specialization are required",
      });
    }

    const worker = await Worker.create({
      name,
      phone,
      specialization,
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
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    const { name, phone, specialization, status } = req.body;

    if (name) worker.name = name;
    if (phone) worker.phone = phone;
    if (specialization) worker.specialization = specialization;
    if (status) worker.status = status;

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

/// TOGGLE STATUS
const toggleWorkerStatus = async (req, res) => {
  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

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
      message: "Worker status toggled successfully",
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
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

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

    await Worker.deleteOne({
      _id: req.params.workerId,
    });

    return res.status(200).json({
      success: true,
      message: "Worker deleted successfully",
      data: worker,
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
  getWorkerSummary,
  createWorker,
  updateWorker,
  toggleWorkerStatus,
  deleteWorker,
};