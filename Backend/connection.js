// connection.js
const mongoose = require("mongoose");

 const url = "mongodb+srv://jobportal25:jobportal%4025@cluster0.up7o086.mongodb.net/mynewdb?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
