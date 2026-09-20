const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { submitDocuments, getProfile, streamDocument, reScanDocument } = require("../controllers/studentController");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
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
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, and PNG files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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
router.post("/scan-document/:docId", protect, reScanDocument);

module.exports = router;
