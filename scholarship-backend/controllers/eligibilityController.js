const Scholarship = require("../models/Scholarship");

exports.checkEligibility = async (req, res) => {
  const { income, marks, category } = req.body;

  const scholarships = await Scholarship.find();

  const eligible = [];
  const notEligible = [];

  scholarships.forEach((s) => {
    if (
      income <= s.incomeLimit &&
      marks >= s.minMarks &&
      (s.category === category || s.category === "All")
    ) {
      eligible.push(s);
    } else {
      notEligible.push({
        name: s.name,
        reason: "Criteria not satisfied",
      });
    }
  });

  res.json({ eligible, notEligible });
};
