const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    incomeLimit: { type: Number, required: true },
    minMarks: { type: Number, required: true },
    category: { type: String, default: "All" },
    amount: { type: Number, required: true },
    provider: { type: String, default: "Government / Trust" },
    educationLevel: { type: String, default: "All" },
    deadline: { type: Date },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);

