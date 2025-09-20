require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
