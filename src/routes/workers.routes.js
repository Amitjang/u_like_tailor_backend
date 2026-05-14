const express = require("express");

const {
  getWorkers,
  getWorkerSummary,
  createWorker,
  updateWorker,
  toggleWorkerStatus,
  deleteWorker,
} = require("../controller/workers.controller");

const router = express.Router();

router.get("/getWorkers", getWorkers);

router.get("/summary/cards", getWorkerSummary);

router.post("/createWorker", createWorker);

router.patch("/ /:workerId", updateWorker);

router.patch("/toggle-status/:workerId", toggleWorkerStatus);

router.delete("/deleteWorker/:workerId", deleteWorker);

module.exports = router;