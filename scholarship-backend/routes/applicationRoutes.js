const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  applyToScholarship,
  getMyApplications,
  getAllApplicationsAdmin,
  updateApplicationStatusAdmin,
  getAnalyticsStatsAdmin,
} = require("../controllers/applicationController");

// Student routes
router.post("/apply/:scholarshipId", protect, applyToScholarship);
router.get("/my-applications", protect, getMyApplications);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllApplicationsAdmin);
router.put("/admin/status/:applicationId", protect, adminOnly, updateApplicationStatusAdmin);
router.get("/admin/analytics", protect, adminOnly, getAnalyticsStatsAdmin);

module.exports = router;
