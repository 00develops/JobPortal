const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require("../controllers/jobController");

// Multer setup for file uploads
const uploadDir = path.join(__dirname, "../uploads/jobs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- ROUTES ----------------

// GET all jobs
router.get("/", getJobs);

// GET single job by ID
router.get("/:id", getJobById);

// CREATE new job
router.post("/", upload.fields([
  { name: "files", maxCount: 12 },
  { name: "logo", maxCount: 1 }
]), createJob);

// UPDATE job
router.put("/:id", upload.fields([
  { name: "files", maxCount: 12 },
  { name: "logo", maxCount: 1 }
]), updateJob);

// DELETE job
router.delete("/:id", deleteJob);

module.exports = router;
