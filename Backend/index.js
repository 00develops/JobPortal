require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // needed for static folder
const connectDB = require("./connection");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const categoryRoutes = require("./routes/categoryRoutes"); // <-- add this

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use('/api/categories', categoryRoutes); // <-- use after import

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
