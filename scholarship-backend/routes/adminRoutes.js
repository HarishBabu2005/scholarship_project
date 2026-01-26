const express = require("express");
const router = express.Router();
const {
  addScholarship,
  getScholarships,
  deleteScholarship
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/scholarship", protect, adminOnly, addScholarship);
router.get("/scholarships", protect, adminOnly, getScholarships);
router.delete(
  "/scholarship/:id",
  protect,
  adminOnly,
  deleteScholarship
);
module.exports = router;
