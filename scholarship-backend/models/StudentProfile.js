const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dob: String,
  gender: String,
  category: String,
  income: Number,
  education: String,
  marks: Number,
  disability: String,
  documents: [{
    name: String,
    fileUrl: String,
    status: { 
      type: String, 
      enum: ['Pending', 'Approved', 'Rejected'], 
      default: 'Pending' 
    },
    adminRemarks: String,
    autoScanScore: { type: Number, default: 0 },
    autoScanStatus: { 
      type: String, 
      enum: ['Verified', 'Discrepancy Detected', 'Unclear Text', 'Pending'],
      default: 'Pending' 
    },
    autoScanDetails: { type: String, default: "" },
    extractedData: { type: mongoose.Schema.Types.Mixed, default: {} }
  }]
}, { timestamps: true });

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
