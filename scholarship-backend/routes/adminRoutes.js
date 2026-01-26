const express = require("express");
const router = express.Router();
const {
  addScholarship,
  getScholarships,
} = require("../controllers/adminController");

router.post("/scholarship", addScholarship);
router.get("/scholarships", getScholarships);

module.exports = router;
