const express = require("express");
const router = express.Router();
const {
  addScholarship,
  getScholarships,
  deleteScholarship,
  getStudentSubmissions,
  verifyDocument,
  batchAutoApproveVerified
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

router.get("/submissions", protect, adminOnly, getStudentSubmissions);
router.put("/submission/:submissionId/document/:docName", protect, adminOnly, verifyDocument);
router.post("/submissions/batch-auto-approve", protect, adminOnly, batchAutoApproveVerified);

module.exports = router;
