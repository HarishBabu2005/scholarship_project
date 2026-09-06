import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("eligibilityResult");
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: "25px",
        paddingBottom: "15px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <Link to="/admin" style={navLinkStyle}>
          ← Dashboard
        </Link>
        <Link to="/admin/applications" style={navLinkStyle}>
          📄 Applications
        </Link>
        <Link to="/admin/verify-documents" style={navLinkStyle}>
          🛡️ Documents
        </Link>
        <Link to="/admin/scholarships" style={navLinkStyle}>
          📋 Scholarships
        </Link>
        <Link to="/admin/add-scholarship" style={navLinkStyle}>
          ➕ Add
        </Link>
      </div>

      <button onClick={handleLogout} style={logoutBtnStyle}>
        Logout
      </button>
    </div>
  );
};

const navLinkStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "38px",
  padding: "0 14px",
  textDecoration: "none",
  color: "#1e3a8a",
  fontWeight: "700",
  fontSize: "13px",
  background: "rgba(255, 255, 255, 0.75)",
  borderRadius: "10px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  transition: "all 0.2s ease",
};

const logoutBtnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "38px",
  padding: "0 18px",
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "700",
  boxShadow: "0 6px 16px rgba(220, 38, 38, 0.3)",
};

export default AdminNavbar;
