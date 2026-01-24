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
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
