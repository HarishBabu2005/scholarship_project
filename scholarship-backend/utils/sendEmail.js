const nodemailer = require("nodemailer");

let testAccountTransporter = null;

// Helper to create or return an SMTP transporter
const getTransporter = async () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const isPlaceholder =
    !user ||
    !pass ||
    user.includes("your_email") ||
    user.includes("example.com") ||
    pass.includes("your_app_password");

  if (
    process.env.SMTP_HOST &&
    user &&
    pass &&
    !isPlaceholder
  ) {
    const isGmail = process.env.SMTP_HOST.includes("gmail") || user.endsWith("@gmail.com");

    if (isGmail) {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: user,
          pass: pass,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  // Fallback to Ethereal dev test account if live credentials are not set
  if (!testAccountTransporter) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log("✉️ Ethereal Email Dev Account created:", testAccount.user);
      testAccountTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (e) {
      console.error("Failed to create Ethereal test account:", e.message);
    }
  }

  return testAccountTransporter;
};

// Core sendEmail function
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.warn("No email transporter available. Email skipped.");
      return;
    }

    const defaultFrom = process.env.EMAIL_USER
      ? `"Scholarship Portal" <${process.env.EMAIL_USER}>`
      : '"Scholarship Portal" <noreply@scholarships.gov.in>';

    const fromAddress = process.env.EMAIL_FROM || defaultFrom;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
    });

    console.log(`✉️ Email dispatched to [${to}] - Subject: "${subject}"`);

    // Log preview URL if using Ethereal dev transporter
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 Preview Email at Ethereal: ${previewUrl}`);
    }

    return info;
  } catch (error) {
    console.error("Error sending email via Nodemailer:", error.message);
  }
};

// Template 1: Application Submission Receipt
const sendApplicationReceiptEmail = async (toEmail, studentName, scholarshipName, amount, applicationId) => {
  const subject = `Application Received: ${scholarshipName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #1e3a8a; margin-top: 0;">Scholarship Application Submitted ✅</h2>
      <p>Dear <strong>${studentName || "Applicant"}</strong>,</p>
      <p>Your application for <strong>${scholarshipName}</strong> has been successfully received and submitted for administrative review.</p>
      
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Application ID:</strong> ${applicationId}</p>
        <p style="margin: 4px 0;"><strong>Scholarship:</strong> ${scholarshipName}</p>
        <p style="margin: 4px 0;"><strong>Award Amount:</strong> ₹${amount ? Number(amount).toLocaleString("en-IN") : "N/A"}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #2563eb; font-weight: bold;">Submitted / Under Review</span></p>
      </div>

      <p>You can track the live verification status of your application anytime by logging into your account dashboard.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">This is an automated notification from the Scholarship Portal. Please do not reply directly to this email.</p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, html });
};

// Template 2: Application Status Update Alert
const sendApplicationStatusEmail = async (toEmail, studentName, scholarshipName, status, adminRemarks) => {
  const isApproved = status === "Approved" || status === "Disbursed";
  const statusColor = isApproved ? "#059669" : status === "Rejected" ? "#dc2626" : "#d97706";

  const subject = `Application Update: ${scholarshipName} - ${status}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #1e3a8a; margin-top: 0;">Application Status Update 🎓</h2>
      <p>Dear <strong>${studentName || "Applicant"}</strong>,</p>
      <p>The status of your application for <strong>${scholarshipName}</strong> has been updated by the administration panel.</p>
      
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid ${statusColor}; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Scholarship:</strong> ${scholarshipName}</p>
        <p style="margin: 4px 0;"><strong>New Status:</strong> <span style="color: ${statusColor}; font-weight: bold; font-size: 16px;">${status}</span></p>
        ${adminRemarks ? `<p style="margin: 8px 0 4px 0;"><strong>Admin Remarks:</strong> ${adminRemarks}</p>` : ""}
      </div>

      <p>Log in to your student portal to view detailed updates and status timelines.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">Scholarship Portal Administration Team</p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, html });
};

// Template 3: Document Verification Notice
const sendDocumentVerificationEmail = async (toEmail, studentName, docName, status, adminRemarks) => {
  const isApproved = status === "Approved";
  const statusColor = isApproved ? "#059669" : "#dc2626";

  const subject = `Document Verification: ${docName} (${status})`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #1e3a8a; margin-top: 0;">Document Verification Notice 🛡️</h2>
      <p>Dear <strong>${studentName || "Student"}</strong>,</p>
      <p>Your uploaded document <strong>${docName}</strong> has been reviewed by our document verification team.</p>
      
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid ${statusColor}; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Document:</strong> ${docName}</p>
        <p style="margin: 4px 0;"><strong>Verification Result:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
        ${adminRemarks ? `<p style="margin: 8px 0 4px 0;"><strong>Remarks:</strong> ${adminRemarks}</p>` : ""}
      </div>

      ${!isApproved ? `<p style="color: #dc2626;">Please re-upload a clear, valid copy of your document on the Student Portal to avoid application delays.</p>` : ""}
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">Scholarship Verification Team</p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, html });
};

// Template 4: Password Reset Link
const sendPasswordResetEmail = async (toEmail, studentName, resetLink) => {
  const subject = "Password Reset Request - Scholarship Portal";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #1e3a8a; margin-top: 0;">Reset Your Password 🔑</h2>
      <p>Hello <strong>${studentName || "User"}</strong>,</p>
      <p>We received a request to reset your password for your Scholarship Portal account.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password Now</a>
      </div>

      <p style="font-size: 13px; color: #64748b;">If the button above does not work, copy and paste this link into your browser:</p>
      <p style="font-size: 12px; word-break: break-all; color: #2563eb;"><a href="${resetLink}">${resetLink}</a></p>

      <p style="font-size: 13px; color: #64748b; margin-top: 20px;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">Scholarship Security Team</p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, html });
};

module.exports = {
  sendEmail,
  sendApplicationReceiptEmail,
  sendApplicationStatusEmail,
  sendDocumentVerificationEmail,
  sendPasswordResetEmail,
};
