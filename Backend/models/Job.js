const mongoose = require("mongoose");

const ImportantDateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
});

const SectionSchema = new mongoose.Schema({
  title: { type: String, default: "", trim: true },
  description: { type: String, default: "" },      // Plain text
  richDescription: { type: String, default: "" },  // Rich text (HTML)
});

const MetaDetailsSchema = new mongoose.Schema({
  title: { type: String, default: "", trim: true },
  description: { type: String, default: "" },
  keywords: { type: String, default: "" },
  schemas: { type: String, default: "" },
});

const JobSchema = new mongoose.Schema(
  {
    // Basic Job Details
    postName: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    advtNumber: { type: String, required: true, trim: true },
    jobType: { type: String, default: "", trim: true },
    jobCategory: { type: String, default: "", trim: true },
    jobLocation: { type: String, default: "", trim: true },
    payScale: { type: String, default: "", trim: true },
    applicationStartDate: { type: Date },
    lastDateToApply: { type: Date },

    // Important Dates
    importantDates: {
      type: [ImportantDateSchema],
      default: [],
    },

    // Sections (plain + rich descriptions)
    applicationFee: { type: SectionSchema, default: () => ({}) },
    vacancyDetails: { type: SectionSchema, default: () => ({}) },
    eligibilityCriteria: { type: SectionSchema, default: () => ({}) },
    salaryBenefits: { type: SectionSchema, default: () => ({}) },
    selectionProcess: { type: SectionSchema, default: () => ({}) },
    importantLinks: { type: SectionSchema, default: () => ({}) },
    howToApply: { type: SectionSchema, default: () => ({}) },

    // Meta
    metaDetails: { type: MetaDetailsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
