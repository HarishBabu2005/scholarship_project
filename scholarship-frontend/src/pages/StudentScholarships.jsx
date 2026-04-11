import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { HARDCODED_SCHOLARSHIPS } from "../data/scholarships";
import API from "../api/axios";
import "../styles/theme.css";

function StudentScholarships() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    const fetchUnread = async () => {
      try {
        const res = await API.get("/notifications");
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchUnread();
  }, [token]);

  if (!token) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("eligibilityResult");
    navigate("/");
  };

  return (
    <AuthLayout>
      {/* Notification Bell */}
      <button
        onClick={() => navigate("/notifications")}
        style={{
          position: "absolute",
          top: "30px",
          right: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "40px",
          width: "40px",
          boxSizing: "border-box",
          background: "rgba(255, 255, 255, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "20px",
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "#ef4444",
              color: "white",
              fontSize: "11px",
              fontWeight: "700",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Logout Button */}
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
