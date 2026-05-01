const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "Task Manager API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Something went wrong.",
  });
});

module.exports = app;
