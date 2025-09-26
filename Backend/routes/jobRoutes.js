const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const router = express.Router();

// Ensure uploads/jobs folder exists
const uploadPath = path.join(__dirname, "..", "uploads", "jobs");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Routes
router.post(
  "/",
  upload.fields([{ name: "files" }, { name: "logo", maxCount: 1 }]),
  createJob
);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put(
  "/:id",
  upload.fields([{ name: "files" }, { name: "logo", maxCount: 1 }]),
  updateJob
);
router.delete("/:id", deleteJob);

module.exports = router;
