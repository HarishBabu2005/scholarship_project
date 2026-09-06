import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";

function ScholarshipDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [hasDocuments, setHasDocuments] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchDetailAndStatus = async () => {
      try {
        const [detailRes, appRes, profileRes] = await Promise.all([
          API.get(`/eligibility/scholarships/${id}`),
          API.get("/applications/my-applications"),
          API.get("/student/profile"),
        ]);

        setScholarship(detailRes.data);

        // Check if student applied
        const applied = appRes.data.some(
          (app) => app.scholarshipId && app.scholarshipId._id === id
        );
        setHasApplied(applied);

        // Check if student uploaded documents
        const docs = profileRes.data.documents || [];
        setHasDocuments(docs.length > 0);
      } catch (err) {
        console.error("Failed to fetch scholarship details or status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailAndStatus();
  }, [id, token]);

  if (!token) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("eligibilityResult");
    navigate("/");
  };

  const handleApplyNow = async () => {
    if (!hasDocuments) {
      alert("Please upload your required verification documents before applying.");
      navigate("/upload-documents");
      return;
    }

    try {
      setApplying(true);
      await API.post(`/applications/apply/${id}`);
      setHasApplied(true);
      alert("Application submitted successfully! You can track progress in 'My Applications'.");
      navigate("/my-applications");
    } catch (err) {
      console.error("Failed to apply", err);
      alert(err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="card">
          <h1>Loading Details...</h1>
        </div>
      </AuthLayout>
    );
  }

  if (!scholarship) {
    return (
      <AuthLayout>
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: "30px",
            right: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "40px",
            boxSizing: "border-box",
            padding: "0 20px",
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "700",
            boxShadow: "0 10px 20px rgba(220, 38, 38, 0.3)",
            zIndex: 10,
          }}
        >
          Logout
        </button>
        <div className="card">
          <h1>Scholarship Not Found</h1>
          <button className="btn-primary" onClick={() => navigate("/scholarships")}>
            Back to Scholarships
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "30px",
          right: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "40px",
          padding: "0 20px",
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "700",
          boxShadow: "0 10px 20px rgba(220, 38, 38, 0.3)",
          zIndex: 10,
        }}
      >
        Logout
      </button>
      <div
        className="card result-card"
        style={{
          maxWidth: "850px",
          width: "95%",
          textAlign: "left",
        }}
      >
        <button
          className="btn-outline"
          onClick={() => navigate("/scholarships")}
          style={{
            width: "auto",
            marginBottom: "20px",
            padding: "8px 15px",
            fontSize: "14px",
          }}
        >
          &larr; Back to Scholarships
        </button>

        <h1
          style={{
            fontSize: "24px",
            color: "#1e3a8a",
            marginBottom: "8px",
          }}
        >
          {scholarship.name}
        </h1>

        {scholarship.provider && (
          <p style={{ color: "#4b5563", fontSize: "14px", margin: "0 0 15px 0", fontWeight: "600" }}>
            🏛️ Provider / Authority: {scholarship.provider}
          </p>
        )}

        {scholarship.description && (
          <div
            style={{
              background: "rgba(255,255,255,0.6)",
              padding: "14px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "14px",
              color: "#374151",
              lineHeight: "1.5",
            }}
          >
            {scholarship.description}
          </div>
        )}

        <div className="detail-section">
          <div className="detail-heading">Eligibility Constraints:</div>
          <ul className="detail-list" style={{ fontSize: "15px" }}>
            <li>
              <strong>Category:</strong> {scholarship.category || "All"}
            </li>
            <li>
              <strong>Annual Income Limit:</strong> Below ₹{scholarship.incomeLimit?.toLocaleString("en-IN")}
            </li>
            <li>
              <strong>Minimum Marks / CGPA:</strong> {scholarship.minMarks}%
            </li>
            {scholarship.educationLevel && (
              <li>
                <strong>Education Level:</strong> {scholarship.educationLevel}
              </li>
            )}
          </ul>
        </div>

        <div className="detail-section">
          <div className="detail-heading">Award Amount:</div>
          <p
            style={{
              color: "#065f46",
              fontSize: "20px",
              fontWeight: "bold",
              margin: "5px 0",
            }}
          >
            ₹{scholarship.amount ? Number(scholarship.amount).toLocaleString("en-IN") : "N/A"}
          </p>
        </div>

        {scholarship.deadline && (
          <div className="detail-section">
            <div className="detail-heading">Application Deadline:</div>
            <p style={{ color: "#dc2626", fontWeight: "bold", fontSize: "15px", margin: "5px 0" }}>
              ⏰ {new Date(scholarship.deadline).toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        )}

        <div className="detail-section">
          <div className="detail-heading">Required Verification Documents:</div>
          <ul className="detail-list" style={{ fontSize: "14px" }}>
            <li>Income Certificate</li>
            <li>Academic Marksheet (10th / 12th / Degree)</li>
            <li>Community / Category Certificate (if applicable)</li>
          </ul>
          {!hasDocuments && (
            <p style={{ color: "#d97706", fontSize: "13px", margin: "8px 0 0 0", fontWeight: "600" }}>
              ⚠️ You have not uploaded verification documents yet. You will be prompted to upload them when applying.
            </p>
          )}
        </div>

        {/* APPLY BUTTON OR APPLIED BADGE */}
        <div style={{ textAlign: "center", marginTop: "30px", display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
          {hasApplied ? (
            <div style={{ width: "100%", textAlign: "center" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  background: "#d1fae5",
                  color: "#065f46",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  marginBottom: "10px",
                }}
              >
                ✓ Application Already Submitted
              </div>
              <br />
              <button
                className="btn-primary"
                style={{ width: "auto", padding: "10px 20px" }}
                onClick={() => navigate("/my-applications")}
              >
                Track Status in My Applications &rarr;
              </button>
            </div>
          ) : (
            <>
              <button
                className="btn-primary"
                style={{
                  padding: "12px 30px",
                  fontSize: "16px",
                  width: "auto",
                }}
                disabled={applying}
                onClick={handleApplyNow}
              >
                {applying ? "Submitting Application..." : "1-Click Apply Now 🚀"}
              </button>

              <button
                className="btn-outline"
                style={{
                  padding: "12px 20px",
                  fontSize: "15px",
                  width: "auto",
                }}
                onClick={() => navigate("/upload-documents")}
              >
                Upload / Update Documents 📁
              </button>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

export default ScholarshipDetail;