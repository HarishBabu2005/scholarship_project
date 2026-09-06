const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scholarshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scholarship",
      required: true,
    },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Approved", "Rejected", "Disbursed"],
      default: "Submitted",
    },
    adminRemarks: {
      type: String,
      default: "",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate active applications from the same student to the same scholarship
applicationSchema.index({ studentId: 1, scholarshipId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
