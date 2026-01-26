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
