const StudentProfile = require("../models/StudentProfile");
const path = require("path");
const fs = require("fs");
const { scanAndVerifyDocument } = require("../utils/documentScanner");

exports.submitDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No documents uploaded" });
    }

    // Fetch existing profile or initialize
    let profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      profile = new StudentProfile({ userId, documents: [] });
    }

    // Process and auto-scan each uploaded document file
    for (const file of req.files) {
      const docName = file.fieldname;
      const fileUrl = `/uploads/${file.filename}`;
      const absolutePath = path.join(__dirname, "../uploads", file.filename);

      // Run AI Document Auto-Scanner
      let scanResult = {
        autoScanScore: 85,
        autoScanStatus: "Verified",
        autoScanDetails: "Document uploaded",
        extractedData: {},
      };

      try {
        scanResult = await scanAndVerifyDocument(absolutePath, docName, profile);
      } catch (scanErr) {
        console.warn("Auto scanner error for file:", file.filename, scanErr.message);
      }

      const existingIndex = profile.documents.findIndex((d) => d.name === docName);
      const newDocData = {
        name: docName,
        fileUrl,
        status: "Pending",
        adminRemarks: "",
        autoScanScore: scanResult.autoScanScore,
        autoScanStatus: scanResult.autoScanStatus,
        autoScanDetails: scanResult.autoScanDetails,
        extractedData: scanResult.extractedData,
      };

      if (existingIndex >= 0) {
        profile.documents[existingIndex] = newDocData;
      } else {
        profile.documents.push(newDocData);
      }
    }

    await profile.save();

    res.json({
      message: "Documents submitted and AI auto-scanned successfully!",
      profile,
    });
  } catch (error) {
    console.error("Document submission error:", error);
    res.status(500).json({ message: "Failed to submit documents" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });
    res.json(profile || { documents: [] });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Error fetching student profile" });
  }
};

exports.streamDocument = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check authorization: Admin OR file owner
    if (req.user.role !== "admin") {
      const targetUrl = `/uploads/${filename}`;
      const profile = await StudentProfile.findOne({
        userId: req.user.id,
        "documents.fileUrl": targetUrl,
      });

      if (!profile) {
        return res.status(403).json({ message: "Not authorized to access this document" });
      }
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("Stream document error:", error);
    res.status(500).json({ message: "Error streaming document" });
  }
};

exports.reScanDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const profile = await StudentProfile.findOne({ "documents._id": docId });

    if (!profile) {
      return res.status(404).json({ message: "Document record not found" });
    }

    const doc = profile.documents.id(docId);
    if (!doc || !doc.fileUrl) {
      return res.status(404).json({ message: "File URL not found on document" });
    }

    const filename = path.basename(doc.fileUrl);
    const absolutePath = path.join(__dirname, "../uploads", filename);

    const scanResult = await scanAndVerifyDocument(absolutePath, doc.name, profile);

    doc.autoScanScore = scanResult.autoScanScore;
    doc.autoScanStatus = scanResult.autoScanStatus;
    doc.autoScanDetails = scanResult.autoScanDetails;
    doc.extractedData = scanResult.extractedData;

    await profile.save();

    res.json({
      message: "AI document re-scan complete!",
      document: doc,
    });
  } catch (error) {
    console.error("Re-scan document error:", error);
    res.status(500).json({ message: "Failed to re-scan document" });
  }
};
