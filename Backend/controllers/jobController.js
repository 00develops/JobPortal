const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Job = require("../models/Job");


// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads/jobs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
// ------------------ CREATE ------------------
const createJob = async (req, res) => {
  try {
    // Parse job data from form-data
    const jobData = JSON.parse(req.body.jobData);

    // Handle uploaded files (PDFs)
    const files = req.files?.files || [];
    const logo = req.files?.logo ? req.files.logo[0] : null;

    if (files.length) {
      jobData.files = files.map(f =>
        path.join("uploads", "jobs", path.basename(f.path))
      );
    }
    if (logo) {
      jobData.logo = path.join("uploads", "jobs", path.basename(logo.path));
    }

    // ✅ Ensure nested objects exist
    jobData.meta = jobData.meta || { title: "", keywords: "", description: "" };
    jobData.eligibility = jobData.eligibility || { extraRequirements: "" };
    jobData.howToApply = jobData.howToApply || "";

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("❌ Create Job Error:", error);
    res.status(400).json({ message: "Bad Request", error: error.message });
  }
};

// ------------------ READ ------------------
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: "Invalid Job ID", error: error.message });
  }
};

// ------------------ UPDATE ------------------
const updateJob = async (req, res) => {
  try {
    const updatedData = JSON.parse(req.body.jobData);

    // Handle files
    const files = req.files?.files || [];
    const logo = req.files?.logo ? req.files.logo[0] : null;

    if (files.length) {
      updatedData.files = files.map(f =>
        path.join("uploads", "jobs", path.basename(f.path))
      );
    }
    if (logo) {
      updatedData.logo = path.join("uploads", "jobs", path.basename(logo.path));
    }

    // Ensure nested objects exist
    updatedData.meta = updatedData.meta || { title: "", keywords: "", description: "" };
    updatedData.eligibility = updatedData.eligibility || { extraRequirements: "" };
    updatedData.howToApply = updatedData.howToApply || "";

    const job = await Job.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("❌ Update Job Error:", error);
    res.status(400).json({ message: "Bad Request", error: error.message });
  }
};

// ------------------ DELETE ------------------
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid Job ID", error: error.message });
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
