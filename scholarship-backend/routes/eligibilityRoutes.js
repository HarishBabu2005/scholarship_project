const express = require("express");
const router = express.Router();
const { checkEligibility } = require("../controllers/eligibilityController");
const Scholarship = require("../models/Scholarship");

router.get("/scholarships", async (req, res) => {
  const scholarships = await Scholarship.find();
  res.json(scholarships);
});

router.post("/check", checkEligibility);

module.exports = router;
