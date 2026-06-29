const express = require("express");

const {
  getWorkers,
  getWorkerSummary,
  createWorker,
  updateWorker,
  toggleWorkerStatus,
  deleteWorker,
} = require("../controller/workers.controller");
const upload = require("../config/mutler");

const router = express.Router();

router.get("/getWorkers", getWorkers);

router.get("/summary/cards", getWorkerSummary);

router.post("/createWorker", upload.single("photo"), createWorker);

router.patch("/updateWorker/:workerId", upload.single("photo"), updateWorker);

router.patch("/toggle-status/:workerId", toggleWorkerStatus);
// router.post("/assign-order/:workerId/:orderId", assignOrderToWorker);
// router.delete("/remove-order/:workerId/:orderId", removeOrderFromWorker);


router.delete("/deleteWorker/:workerId", deleteWorker);

module.exports = router;