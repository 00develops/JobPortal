const mongoose = require("mongoose");

// Subschemas
const ImportantDateSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
});

const FeeSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  fee: { type: String, default: "" },
});

const VacancySchema = new mongoose.Schema({
  list: [
    {
      postName: { type: String, required: true, trim: true },
      total: { type: Number, default: 0 },
      UR: { type: Number, default: 0 },
      EWS: { type: Number, default: 0 },
      OBC: { type: Number, default: 0 },
      SC: { type: Number, default: 0 },
      ST: { type: Number, default: 0 },
      PwBD: { type: Number, default: 0 }
    }
  ],
  extraRequirements: { type: String, default: "" }
});

const LinkSchema = new mongoose.Schema({
  type: { type: String, default: "Other", trim: true },
  label: { type: String, default: "", trim: true },
  url: { type: String, default: "", trim: true },
});

const SectionSchema = new mongoose.Schema({
  title: { type: String, default: "", trim: true },
  description: { type: String, default: "" },      // Plain text
  richDescription: { type: String, default: "" },  // HTML / Rich text
});


// MetaDetails schema
const MetaDetailsSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
   keywords: { type: String, default: "" },
  schemas: { type: String, default: "" }
});

// Main Job Schema
const JobSchema = new mongoose.Schema(
  {
    // Basic Job Details
    postName: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    advtNumber: { type: String, required: true, trim: true },
    jobType: { type: String, default: "", trim: true },
    sector: { type: String, default: "", trim: true },
    jobCategory: { type: String, default: "", trim: true },
    jobLocation: { type: String, default: "", trim: true },
    experience: { type: String, default: "" },
    modeOfExam: { type: String, default: "" },
    shortDescription: { type: String, default: "" },

    // Important Dates
    dates: { type: [ImportantDateSchema], default: [] },

    // Application Fee
    fees: { type: [FeeSchema], default: [] },

    // Vacancies
    vacancies: { type: [VacancySchema], default: [] },

    // Eligibility
    eligibility: {
      qualification: { type: String, default: "Graduate" },
      finalYearEligible: { type: String, default: "",trim:true },
      ageMin: { type: Number },
      ageMax: { type: Number },
      ageRelaxation: { type: String, default: "" },
      gateRequired: { type: String, default: "",trim:true },
      gateCodes: { type: String, default: "" },
      extraRequirements: { type: String, default: "" }, // Rich text
    },

    // Salary
    salary: {
      payScale: { type: String, default: "" },
      inHand: { type: String, default: "" },
      allowances: { type: String, default: "" },
    },

    // Selection Process
    selection: { type: [String], default: [] },

    // Links
    links: { type: [LinkSchema], default: [] },

    // How to Apply
    howToApply: { type: String, default: "" }, // Rich text

    // Uploaded files / logo
    files: { type: [String], default: [] }, // store file URLs / paths
    logo: { type: String, default: "" },

    // Meta
    metaDetails: { type: MetaDetailsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
