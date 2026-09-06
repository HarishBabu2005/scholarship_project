const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { submitDocuments, getProfile, streamDocument } = require("../controllers/studentController");
const multer = require("multer");
const path = require("path");

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}_${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 300 * 1024 }, // 300KB
});

// Accept up to 12 document fields
router.post(
  "/submit-documents",
  protect,
  upload.any(),
  submitDocuments
);

router.get("/profile", protect, getProfile);
router.get("/document/:filename", protect, streamDocument);

module.exports = router;

