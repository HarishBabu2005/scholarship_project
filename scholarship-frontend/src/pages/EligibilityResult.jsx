import { Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/theme.css";

function EligibilityResult() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  const data = JSON.parse(localStorage.getItem("eligibilityResult")) || {
    eligible: [],
    notEligible: [],
  };

  const { eligible, notEligible } = data;
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("eligibilityResult");
    navigate("/");
  };

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

      <div style={pageStyle}>
        <div style={glassCard}>
          <h1 style={mainTitle}>Eligibility Result</h1>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "30px" }}>
            Based on your details, here are the results
          </p>

          {/* ✅ Eligible Scholarships */}
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ ...sectionTitle, color: "#065f46" }}>Eligible Scholarships</h2>
            {eligible.length === 0 ? (
              <p style={emptyText}>No eligible scholarships found</p>
            ) : (
              <div style={listContainer}>
                {eligible.map((s, index) => (
                  <div key={index} style={resultCard}>
                    <div style={logoSection}>
                      <div style={placeholderLogo}>🎓</div>
                    </div>
                    
                    <div style={contentSection}>
                      <h3 style={scholarshipTitle}>{s.name}</h3>
                      <div style={infoGrid}>
                        <div>
                          <div style={label}>Eligibility</div>
                          <ul style={criteriaList}>
                            <li>Category: {s.category || "All"}</li>
                            <li>Income: Below ₹{s.incomeLimit}</li>
                            <li>Min Marks: {s.minMarks}%</li>
                          </ul>
                        </div>
                        <div style={amountBox}>
                          <span style={{ fontSize: "14px", color: "#6b7280" }}>💰 Amount:</span>
                          <span style={amountValue}>₹{s.amount}</span>
                        </div>
                      </div>
                    </div>

                    <div style={dateSection}>
                      Last Updated: {new Date().toLocaleDateString("en-GB")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ❌ Not Eligible Scholarships */}
          <div>
            <h2 style={{ ...sectionTitle, color: "#991b1b" }}>Not Eligible</h2>
            {notEligible.length === 0 ? (
              <p style={emptyText}>—</p>
            ) : (
              <div style={listContainer}>
                {notEligible.map((s, index) => (
                  <div key={index} style={{ ...resultCard, opacity: 0.8, background: "rgba(255, 235, 235, 0.6)" }}>
                    <div style={logoSection}>
                      <div style={{ ...placeholderLogo, background: "#fee2e2", color: "#ef4444" }}>✕</div>
                    </div>
                    
                    <div style={contentSection}>
                      <h3 style={{ ...scholarshipTitle, color: "#991b1b" }}>{s.name}</h3>
                      <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", color: "#7f1d1d", fontSize: "14px" }}>
                        <strong>Reason:</strong> {s.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={buttonGroup}>
            <button
              className="btn-outline"
              onClick={() => navigate("/eligibility")}
              style={{ width: "auto" }}
            >
              &larr; Re-check Eligibility
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate("/scholarships")}
              style={{ width: "auto" }}
            >
              View All Scholarships
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

const pageStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "40px 20px"
};

const glassCard = {
  width: "100%",
  maxWidth: "1100px",
  padding: "40px",
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  maxHeight: "85vh",
  overflowY: "auto"
};

const mainTitle = {
  textAlign: "center",
  fontSize: "32px",
  fontWeight: "700",
  color: "#1e3a8a",
  marginBottom: "10px"
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "15px",
  paddingBottom: "8px",
  borderBottom: "2px solid rgba(0,0,0,0.05)"
};

const listContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const resultCard = {
  display: "flex",
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  position: "relative",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  border: "1px solid #e5e7eb",
  gap: "24px",
  flexWrap: "wrap"
};

const logoSection = {
  flex: "0 0 100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const placeholderLogo = {
  width: "100%",
  height: "80px",
  background: "#f0fdf4",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  color: "#10b981",
  border: "1px solid #d1fae5"
};

const contentSection = {
  flex: "1",
  minWidth: "300px"
};

const scholarshipTitle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "12px"
};

const infoGrid = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  flexWrap: "wrap"
};

const label = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#4b5563",
  marginBottom: "4px"
};

const criteriaList = {
  paddingLeft: "20px",
  fontSize: "14px",
  color: "#6b7280",
  margin: 0
};

const amountBox = {
  background: "#f9fafb",
  padding: "12px 20px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end"
};

const amountValue = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#059669"
};

const dateSection = {
  position: "absolute",
  bottom: "24px",
  right: "24px",
  fontSize: "12px",
  color: "#9ca3af"
};

const emptyText = {
  textAlign: "center",
  color: "#9ca3af",
  fontStyle: "italic"
};

const buttonGroup = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  marginTop: "40px"
};

export default EligibilityResult;
