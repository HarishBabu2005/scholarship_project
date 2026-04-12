import { useEffect, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";
import { Navigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

function AdminScholarshipList() {
  const [scholarships, setScholarships] = useState([]);

  const fetchScholarships = async () => {
    try {
      const res = await API.get("/admin/scholarships");
      setScholarships(res.data);
    } catch (error) {
      alert("Failed to load scholarships");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scholarship?")) return;

    try {
      await API.delete(`/admin/scholarship/${id}`);
      fetchScholarships();
    } catch (error) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  if (!localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return (
    <AuthLayout>
      <AdminNavbar />
      <div style={pageStyle}>
        <div style={glassCard}>
          <h1 style={mainTitle}>Scholarship List</h1>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "30px" }}>
            Admin Panel - Manage system scholarships
          </p>

          <div style={listContainer}>
            {scholarships.length === 0 ? (
              <p style={emptyText}>No scholarships found</p>
            ) : (
              scholarships.map((s) => (
                <div key={s._id} style={resultCard}>
                  <div style={logoSection}>
                    <div style={placeholderLogo}>⚙️</div>
                  </div>
                  
                  <div style={contentSection}>
                    <h3 style={scholarshipTitle}>{s.name}</h3>
                    <div style={infoGrid}>
                      <div>
                        <div style={label}>Constraints</div>
                        <ul style={criteriaList}>
                          <li>Category: {s.category || "All"}</li>
                          <li>Income Limit: ₹{s.incomeLimit}</li>
                          <li>Min Marks: {s.minMarks}%</li>
                        </ul>
                      </div>
                      <div style={amountBox}>
                        <span style={{ fontSize: "14px", color: "#6b7280" }}>💰 Amount:</span>
                        <span style={amountValue}>₹{s.amount}</span>
                      </div>
                    </div>
                  </div>

                  <div style={actionSection}>
                    <button
                      className="btn-outline"
                      onClick={() => handleDelete(s._id)}
                      style={{ 
                        borderColor: "#ef4444", 
                        color: "#ef4444",
                        padding: "8px 20px",
                        fontSize: "14px",
                        background: "rgba(239, 68, 68, 0.05)"
                      }}
                    >
                      🗑️ Delete
                    </button>
                    <div style={dateSection}>
                      Last Updated: {new Date(s.updatedAt || Date.now()).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                </div>
              ))
            )}
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
  padding: "100px 20px 40px"
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
  flexWrap: "wrap",
  transition: "transform 0.2s ease",
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
  background: "#f8fafc",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  color: "#64748b",
  border: "1px solid #e2e8f0"
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

const actionSection = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "space-between",
  minWidth: "120px"
};

const dateSection = {
  marginTop: "10px",
  fontSize: "12px",
  color: "#9ca3af"
};

const emptyText = {
  textAlign: "center",
  color: "#9ca3af",
  fontStyle: "italic",
  width: "100%"
};

export default AdminScholarshipList;
