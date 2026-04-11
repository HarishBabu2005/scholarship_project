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
      <div className="card result-card">
        <h1>Eligibility Result</h1>
        <p>Based on your details, here are the results</p>

        {/* ✅ Eligible Scholarships */}
        <h3 style={{ marginTop: "15px", color: "#065f46" }}>
          Eligible Scholarships
        </h3>

        {eligible.length === 0 ? (
          <p>No eligible scholarships found</p>
        ) : (
          <div className="scholarship-grid">
            {eligible.map((s, index) => (
              <div key={index} className="scholarship-card">
                <div className="scholarship-title">{s.name}</div>

                <div className="badge-group">
                  <span className="badge">
                    Category: {s.category || "All"}
                  </span>
                  <span className="badge">
                    Income ≤ ₹{s.incomeLimit}
                  </span>
                  <span className="badge">
                    Min Marks: {s.minMarks}
                  </span>
                </div>

                <div className="amount">
                  Scholarship Amount: ₹{s.amount}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ❌ Not Eligible Scholarships */}
        <h3 style={{ marginTop: "20px", color: "#991b1b" }}>
          Not Eligible
        </h3>

        {notEligible.length === 0 ? (
          <p>—</p>
        ) : (
          <div className="scholarship-grid">
            {notEligible.map((s, index) => (
              <div
                key={index}
                className="scholarship-card"
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                }}
              >
                <div className="scholarship-title">{s.name}</div>
                <div style={{ fontSize: "13px", color: "#7f1d1d" }}>
                  Reason: {s.reason}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="btn-outline"
          style={{ marginTop: "20px" }}
          onClick={() => navigate("/eligibility")}
        >
          Back
        </button>
      </div>
    </AuthLayout>
  );
}

export default EligibilityResult;
