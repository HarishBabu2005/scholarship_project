import React, { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalScholarships: 0,
    totalApplications: 0,
    pendingReviews: 0,
    approvedCount: 0,
    disbursedCount: 0,
    rejectedCount: 0,
    totalDisbursedAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/applications/admin/analytics");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("eligibilityResult");
    navigate("/");
  };

  return (
    <AuthLayout>
      <div style={dashboardWrapper}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <div>
            <h1 style={titleStyle}>Administrative Control Panel</h1>
            <p style={{ margin: "5px 0 0 0", color: "#4b5563" }}>
              Overview of scholarship statistics, applicant status, and disbursals
            </p>
          </div>
          <button onClick={handleLogout} style={topRightLogoutStyle}>
            Logout
          </button>
        </div>

        {/* Analytics Summary Banner */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginBottom: "35px",
          }}
        >
          <div style={statCardStyle}>
            <span style={statNumberStyle}>{loading ? "..." : stats.totalScholarships}</span>
            <span style={statLabelStyle}>Scholarships Listed</span>
          </div>

          <div style={statCardStyle}>
            <span style={statNumberStyle}>{loading ? "..." : stats.totalApplications}</span>
            <span style={statLabelStyle}>Total Applications</span>
          </div>

          <div style={{ ...statCardStyle, background: "rgba(245, 158, 11, 0.25)" }}>
            <span style={{ ...statNumberStyle, color: "#d97706" }}>
              {loading ? "..." : stats.pendingReviews}
            </span>
            <span style={statLabelStyle}>Pending Reviews</span>
          </div>

          <div style={{ ...statCardStyle, background: "rgba(16, 185, 129, 0.25)" }}>
            <span style={{ ...statNumberStyle, color: "#059669" }}>
              {loading ? "..." : stats.approvedCount}
            </span>
            <span style={statLabelStyle}>Approved Applications</span>
          </div>

          <div style={{ ...statCardStyle, background: "rgba(59, 130, 246, 0.25)", gridColumn: "span 2" }}>
            <span style={{ ...statNumberStyle, color: "#1d4ed8" }}>
              {loading ? "..." : `₹${stats.totalDisbursedAmount.toLocaleString("en-IN")}`}
            </span>
            <span style={statLabelStyle}>Total Funds Disbursed</span>
          </div>
        </div>

        {/* Admin Navigation Grid */}
        <div style={cardGrid}>
          <Link to="/admin/applications" style={dashboardCard}>
            <div style={iconStyle}>📄</div>
            <h3>Application Tracker & Disbursal</h3>
            <p>Review student applications, approve candidates, and track disbursals.</p>
          </Link>

          <Link to="/admin/verify-documents" style={dashboardCard}>
            <div style={iconStyle}>🛡️</div>
            <h3>Verify Student Documents</h3>
            <p>Inspect income certificates and marksheets submitted by applicants.</p>
          </Link>

          <Link to="/admin/scholarships" style={dashboardCard}>
            <div style={iconStyle}>📋</div>
            <h3>Manage Scholarships</h3>
            <p>View, update, or remove existing scholarship listings.</p>
          </Link>

          <Link to="/admin/add-scholarship" style={dashboardCard}>
            <div style={iconStyle}>➕</div>
            <h3>Add New Scholarship</h3>
            <p>Create new funding schemes with customized criteria.</p>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

// Styles
const dashboardWrapper = {
  width: "95%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px 20px",
  color: "#1e3a8a",
};

const titleStyle = { margin: 0, fontWeight: "800", fontSize: "28px" };

const statCardStyle = {
  background: "rgba(255, 255, 255, 0.4)",
  backdropFilter: "blur(12px)",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
};

const statNumberStyle = {
  fontSize: "26px",
  fontWeight: "bold",
  color: "#1e3a8a",
};

const statLabelStyle = {
  fontSize: "13px",
  color: "#4b5563",
  marginTop: "4px",
  fontWeight: "600",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "25px",
};

const dashboardCard = {
  background: "rgba(255, 255, 255, 0.35)",
  backdropFilter: "blur(15px)",
  borderRadius: "20px",
  padding: "30px 20px",
  textDecoration: "none",
  color: "inherit",
  textAlign: "center",
  border: "1px solid rgba(255, 255, 255, 0.45)",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
  transition: "transform 0.3s ease, background 0.3s ease",
};

const iconStyle = { fontSize: "42px", marginBottom: "15px" };

const topRightLogoutStyle = {
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
};

export default AdminDashboard;
