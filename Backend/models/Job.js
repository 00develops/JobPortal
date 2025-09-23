const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    sector: { type: String, required: true },
    department: { type: String, required: true },
    postName: { type: String, required: true },
    totalVacancies: { type: Number, required: true },
    ageLimit: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      referenceDate: { type: Date, required: true },
      relaxations: { type: String },
    },
    qualification: { type: String, required: true },
    finalYearEligible: { type: Boolean, default: false },
    experienceRequired: { type: Boolean, default: false },
    genderRestriction: { type: String, enum: ["None", "Male", "Female","Other","All"], default: "None" },
    categoryReservation: [{ type: String, enum: ["UR", "OBC", "SC", "ST", "EWS"] }],
    jobLocation: { type: String, required: true },
    selectionProcess: [{ type: String, enum: ["Tier-I", "Tier-II", "Interview", "DV", "Medical"] }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
