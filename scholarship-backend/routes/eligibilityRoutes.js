const express = require("express");
const router = express.Router();
const { checkEligibility } = require("../controllers/eligibilityController");
const Scholarship = require("../models/Scholarship");

router.get("/scholarships", async (req, res) => {
  const scholarships = await Scholarship.find();
  res.json(scholarships);
});

router.get("/scholarships/:id", async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/check", checkEligibility);

module.exports = router;
