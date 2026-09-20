const Scholarship = require("../models/Scholarship");
const StudentProfile = require("../models/StudentProfile");
const Notification = require("../models/Notification");
const { sendDocumentVerificationEmail } = require("../utils/sendEmail");

exports.addScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);

    // Emit socket event to notify all connected clients about the new scholarship
    const io = req.app.get("io");
    if (io) {
      io.emit("new_scholarship", {
        title: "New Scholarship Available!",
        message: `A new scheme '${scholarship.name}' has just been posted. Check your eligibility now.`,
        scholarship,
      });
    }

    res.json({ message: "Scholarship added", scholarship });
  } catch (error) {
    res.status(500).json({ message: "Error adding scholarship" });
  }
};

exports.getScholarships = async (req, res) => {
  const scholarships = await Scholarship.find();
  res.json(scholarships);
};

exports.deleteScholarship = async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: "Scholarship deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.getStudentSubmissions = async (req, res) => {
  try {
    const profiles = await StudentProfile.find().populate("userId", "name email");
    const formattedSubmissions = profiles.map((profile) => ({
      id: profile._id.toString(),
      studentName: profile.userId ? profile.userId.name : "Unknown",
      email: profile.userId ? profile.userId.email : "Unknown",
      documents: profile.documents,
    }));
    res.json(formattedSubmissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching student submissions" });
  }
};

exports.verifyDocument = async (req, res) => {
  const { submissionId, docName } = req.params;
  const { status, adminRemarks } = req.body;

  try {
    const profile = await StudentProfile.findById(submissionId).populate("userId", "name email");
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const document = profile.documents.find((doc) => doc.name === docName);
    if (!document) return res.status(404).json({ message: "Document not found" });

    document.status = status;
    if (adminRemarks) document.adminRemarks = adminRemarks;

    await profile.save();

    let notificationObj = null;

    if (status === "Rejected") {
      notificationObj = await Notification.create({
        userId: profile.userId._id || profile.userId,
        title: "Document Rejected ❌",
        message: `Your document '${docName}' has been rejected. Reason: ${adminRemarks || "Not provided"}`,
      });
    } else if (status === "Approved") {
      notificationObj = await Notification.create({
        userId: profile.userId._id || profile.userId,
        title: "Document Approved ✅",
        message: `Your document '${docName}' has been approved.`,
      });
    }

    // Emit real-time notification to the student's socket room
    const io = req.app.get("io");
    if (io && profile.userId) {
      const studentRoom = (profile.userId._id || profile.userId).toString();
      io.to(studentRoom).emit("notification", {
        title: notificationObj ? notificationObj.title : `Document ${status}`,
        message: notificationObj ? notificationObj.message : `Your document '${docName}' status is now ${status}`,
        docName,
        status,
      });
    }

    // Dispatch document verification email via Nodemailer
    if (profile.userId && profile.userId.email) {
      sendDocumentVerificationEmail(
        profile.userId.email,
        profile.userId.name,
        docName,
        status,
        adminRemarks
      );
    }

    res.json({ message: "Document updated successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating document" });
  }
};

exports.batchAutoApproveVerified = async (req, res) => {
  try {
    const profiles = await StudentProfile.find({ "documents.status": "Pending" }).populate("userId", "name email");
    let autoApprovedCount = 0;

    for (const profile of profiles) {
      let updated = false;
      for (const doc of profile.documents) {
        if (doc.status === "Pending" && (doc.autoScanScore >= 85 || doc.autoScanStatus === "Verified")) {
          doc.status = "Approved";
          doc.adminRemarks = `Auto-Approved by AI Verification Engine (Confidence Match: ${doc.autoScanScore || 90}%)`;
          updated = true;
          autoApprovedCount++;

          if (profile.userId && profile.userId.email) {
            sendDocumentVerificationEmail(
              profile.userId.email,
              profile.userId.name,
              doc.name,
              "Approved",
              doc.adminRemarks
            );
          }
        }
      }
      if (updated) {
        await profile.save();
      }
    }

    res.json({
      message: `Batch auto-approval complete! Approved ${autoApprovedCount} verified documents.`,
      autoApprovedCount,
    });
  } catch (error) {
    console.error("Batch auto-approve error:", error);
    res.status(500).json({ message: "Failed to batch auto-approve documents" });
  }
};
