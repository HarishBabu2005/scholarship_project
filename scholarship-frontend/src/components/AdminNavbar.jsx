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
    <>
      <Link to="/admin" style={dashboardLinkStyle}>← Dashboard</Link>
      <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
    </>
  );
};

const dashboardLinkStyle = {
  position: "fixed",
  top: "30px",
  left: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "40px",
  boxSizing: "border-box",
  padding: "0 20px",
  textDecoration: "none",
  color: "#1e3a8a",
  fontWeight: "700",
  fontSize: "14px",
  background: "rgba(255, 255, 255, 0.4)",
  borderRadius: "12px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  zIndex: 1000,
  transition: "all 0.3s ease",
};

const logoutBtnStyle = {
  position: "fixed",
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
  zIndex: 1000,
  transition: "all 0.3s ease",
};

export default AdminNavbar;
