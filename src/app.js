const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const authRoutes = require("./routes/auth.routes");
const serviceRoutes = require("./routes/services.routes");
const orderRoutes = require("./routes/orders.routes");
const customerRoutes = require("./routes/customers.routes");
const workerRoutes = require("./routes/workers.routes");
const paymentRoutes = require("./routes/payments.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(cors());

// IMPORTANT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/testing", require("./routes/testing.routes"));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
module.exports = app;