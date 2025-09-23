const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  deleteJob
} = require("../controllers/jobController"); // <-- no .js if using require sometimes

const router = express.Router();

router.post("/", createJob);          
router.get("/", getJobs);             
router.get("/:id", getJobById);       
router.delete("/:id", deleteJob);     

module.exports = router;
