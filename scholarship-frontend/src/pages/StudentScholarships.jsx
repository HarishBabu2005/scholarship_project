import { Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { HARDCODED_SCHOLARSHIPS } from "../data/scholarships";
import "../styles/theme.css";

function StudentScholarships() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <AuthLayout>
      <div
        className="card result-card"
        style={{ maxWidth: "1200px", width: "95%" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexWrap: "wrap",
            gap: "15px"
          }}
        >
          <div style={{ textAlign: "left" }}>
            <h1>All Scholarships</h1>
            <p style={{ marginBottom: 0 }}>Discover available opportunities</p>
          </div>
          <div>
            <button
              className="btn-primary"
              onClick={() => navigate("/eligibility")}
              style={{ padding: "10px 20px", width: "auto" }}
            >
              Check My Eligibility
            </button>
          </div>
        </div>

        <div className="blog-grid">
          {HARDCODED_SCHOLARSHIPS.map((s) => (
            <div
              key={s.id}
              className="scholarship-card detailed-card"
              onClick={() => navigate(`/scholarships/${s.id}`)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <div className="detailed-title" style={{ fontSize: "18px", borderBottom: "none" }}>
                {s.title}
              </div>

              <div className="detail-section" style={{ marginBottom: "0" }}>
                <div className="detail-heading">Eligibility:</div>
                <ul className="detail-list">
                  {s.eligibility.slice(0, 3).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                  {s.eligibility.length > 3 && (
                    <li>...</li>
                  )}
                </ul>
              </div>

              <div style={{ width: "100%", textAlign: "center", marginTop: "10px", fontSize: "13px", color: "#6b7280", fontWeight: "600" }}>
                Click to Read More &rarr;
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}

export default StudentScholarships;

