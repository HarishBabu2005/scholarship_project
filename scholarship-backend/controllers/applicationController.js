const Application = require("../models/Application");
const Scholarship = require("../models/Scholarship");
const StudentProfile = require("../models/StudentProfile");
const Notification = require("../models/Notification");

// @desc Apply to a scholarship
// @route POST /api/applications/apply/:scholarshipId
// @access Private (Student)
exports.applyToScholarship = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { scholarshipId } = req.params;

    // Check if scholarship exists
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }

    // Check if student has a profile and at least one document
    const profile = await StudentProfile.findOne({ userId: studentId });
    if (!profile || !profile.documents || profile.documents.length === 0) {
      return res.status(400).json({
        message: "Please upload your required verification documents before applying.",
      });
    }

    // Check if student has already applied
    const existing = await Application.findOne({ studentId, scholarshipId });
    if (existing) {
      return res.status(400).json({
        message: "You have already submitted an application for this scholarship.",
      });
    }

    // Create application
    const application = await Application.create({
      studentId,
      scholarshipId,
      status: "Submitted",
    });

    // Notify student
    await Notification.create({
      userId: studentId,
      title: "Application Submitted",
      message: `Your application for '${scholarship.name}' has been successfully submitted and is under initial review.`,
    });

    res.status(201).json({
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    console.error("Apply scholarship error:", error);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

// @desc Get student's submitted applications
// @route GET /api/applications/my-applications
// @access Private (Student)
exports.getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const applications = await Application.find({ studentId })
      .populate("scholarshipId")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({ message: "Error fetching applications" });
  }
};

// @desc Get all student applications (Admin)
// @route GET /api/applications/admin/all
// @access Private (Admin)
exports.getAllApplicationsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "All" ? { status } : {};

    const applications = await Application.find(filter)
      .populate("studentId", "name email")
      .populate("scholarshipId")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Admin get applications error:", error);
    res.status(500).json({ message: "Error fetching all applications" });
  }
};

// @desc Update application status (Admin)
// @route PUT /api/applications/admin/status/:applicationId
// @access Private (Admin)
exports.updateApplicationStatusAdmin = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, adminRemarks } = req.body;

    const application = await Application.findById(applicationId).populate("scholarshipId");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    if (adminRemarks !== undefined) {
      application.adminRemarks = adminRemarks;
    }

    await application.save();

    // Create notification for student
    const scholarshipName = application.scholarshipId ? application.scholarshipId.name : "Scholarship";
    let message = `Your application status for '${scholarshipName}' has been updated to '${status}'.`;
    if (adminRemarks) {
      message += ` Admin remarks: ${adminRemarks}`;
    }

    await Notification.create({
      userId: application.studentId,
      title: `Application Status Updated: ${status}`,
      message,
    });

    res.json({ message: "Application status updated successfully", application });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Error updating application status" });
  }
};

// @desc Get administrative dashboard analytics
// @route GET /api/applications/admin/analytics
// @access Private (Admin)
exports.getAnalyticsStatsAdmin = async (req, res) => {
  try {
    const totalScholarships = await Scholarship.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingReviews = await Application.countDocuments({ status: { $in: ["Submitted", "Under Review"] } });
    const approvedCount = await Application.countDocuments({ status: "Approved" });
    const disbursedCount = await Application.countDocuments({ status: "Disbursed" });
    const rejectedCount = await Application.countDocuments({ status: "Rejected" });

    // Calculate total money disbursed
    const disbursedApps = await Application.find({ status: "Disbursed" }).populate("scholarshipId");
    const totalDisbursedAmount = disbursedApps.reduce((acc, app) => {
      const amt = app.scholarshipId && app.scholarshipId.amount ? Number(app.scholarshipId.amount) : 0;
      return acc + amt;
    }, 0);

    res.json({
      totalScholarships,
      totalApplications,
      pendingReviews,
      approvedCount,
      disbursedCount,
      rejectedCount,
      totalDisbursedAmount,
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    res.status(500).json({ message: "Error fetching analytics stats" });
  }
};
