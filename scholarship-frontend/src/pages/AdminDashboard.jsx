import React from "react";
import AuthLayout from "../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("eligibilityResult");
    navigate("/");
  };

  return (
    <AuthLayout>
      <div style={dashboardWrapper}>
        <h1 style={titleStyle}>Admin Dashboard</h1>
        <button onClick={handleLogout} style={topRightLogoutStyle}>Logout</button>

        <div style={cardGrid}>
          <Link to="/admin/scholarships" style={dashboardCard}>
            <div style={iconStyle}>📋</div>
            <h3>Scholarship List</h3>
            <p>Manage and view all existing scholarship entries.</p>
          </Link>

          <Link to="/admin/add-scholarship" style={dashboardCard}>
            <div style={iconStyle}>➕</div>
            <h3>Add Scholarship</h3>
            <p>Create new scholarship opportunities for students.</p>
          </Link>

          <Link to="/admin/verify-documents" style={dashboardCard}>
            <div style={iconStyle}>🛡️</div>
            <h3>Verify Documents</h3>
            <p>Check and verify documents submitted by applicants.</p>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

// Styles
const dashboardWrapper = {
  width: "100%",
  padding: "80px 40px 40px",
  color: "#1e3a8a",
};

const headerContainer = {
  marginBottom: "40px",
  paddingBottom: "20px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
};

const titleStyle = { margin: 0, fontWeight: "800" };

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "30px",
};

const dashboardCard = {
  background: "rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(15px)",
  borderRadius: "20px",
  padding: "35px",
  textDecoration: "none",
  color: "inherit",
  textAlign: "center",
  border: "1px solid rgba(255, 255, 255, 0.35)",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, background 0.3s ease",
};

const iconStyle = { fontSize: "50px", marginBottom: "20px" };

const topRightLogoutStyle = {
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
};

export default AdminDashboard;
