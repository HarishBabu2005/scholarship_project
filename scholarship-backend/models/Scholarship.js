const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema({
  name: String,
  incomeLimit: Number,
  minMarks: Number,
  category: String,
  amount: String,
});

module.exports = mongoose.model("Scholarship", scholarshipSchema);
