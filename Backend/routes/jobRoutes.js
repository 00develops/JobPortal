const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobController");

const router = express.Router();

router.post("/", createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);   // <-- added
router.delete("/:id", deleteJob);

module.exports = router;
