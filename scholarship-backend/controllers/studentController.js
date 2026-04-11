const StudentProfile = require("../models/StudentProfile");

exports.submitDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No documents uploaded" });
    }

    // Build documents array from uploaded files
    const documents = req.files.map((file) => ({
      name: file.fieldname,
      fileUrl: `/uploads/${file.filename}`,
      status: "Pending",
    }));

    // Check if student already has a profile — update or create
    let profile = await StudentProfile.findOne({ userId });

    if (profile) {
      // Merge: update existing docs or add new ones
      documents.forEach((newDoc) => {
        const existingIndex = profile.documents.findIndex(
          (d) => d.name === newDoc.name
        );
        if (existingIndex >= 0) {
          profile.documents[existingIndex].fileUrl = newDoc.fileUrl;
          profile.documents[existingIndex].status = "Pending";
          profile.documents[existingIndex].adminRemarks = "";
        } else {
          profile.documents.push(newDoc);
        }
      });
      await profile.save();
    } else {
      profile = await StudentProfile.create({
        userId,
        documents,
      });
    }

    res.json({
      message: "Documents submitted successfully for admin verification",
      profile,
    });
  } catch (error) {
    console.error("Document submission error:", error);
    res.status(500).json({ message: "Failed to submit documents" });
  }
};
