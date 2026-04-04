const Scholarship = require("../models/Scholarship");
const StudentProfile = require("../models/StudentProfile");
const Notification = require("../models/Notification");

exports.addScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
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
    const formattedSubmissions = profiles.map(profile => ({
      id: profile._id.toString(),
      studentName: profile.userId ? profile.userId.name : "Unknown",
      email: profile.userId ? profile.userId.email : "Unknown",
      documents: profile.documents
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
    const profile = await StudentProfile.findById(submissionId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const document = profile.documents.find(doc => doc.name === docName);
    if (!document) return res.status(404).json({ message: "Document not found" });

    document.status = status;
    if (adminRemarks) document.adminRemarks = adminRemarks;

    await profile.save();

    if (status === "Rejected") {
      await Notification.create({
        userId: profile.userId,
        title: "Document Rejected",
        message: `Your document '${docName}' has been rejected. Reason: ${adminRemarks || 'Not provided'}`,
      });
    } else if (status === "Approved") {
      await Notification.create({
        userId: profile.userId,
        title: "Document Approved",
        message: `Your document '${docName}' has been approved.`,
      });
    }

    res.json({ message: "Document updated successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating document" });
  }
};
