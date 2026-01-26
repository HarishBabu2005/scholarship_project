const Scholarship = require("../models/Scholarship");

exports.addScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    res.json({ message: "Scholarship added", scholarship });
  } catch (error) {
    res.status(500).json({ message: "Error adding scholarship" });
  }
};

exports.getScholarships = async (req, res) => {
  const scholarships = await Scholarship.find();
  res.json(scholarships);
};
exports.deleteScholarship = async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: "Scholarship deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

