import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import "../styles/theme.css";
import {  Navigate ,useNavigate } from "react-router-dom";
import API from "../api/axios";


function EligibilityForm() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    category: "",
    income: "",
    education: "",
    marks: "",
    disability: "no",
  });

  const [errors, setErrors] = useState({});
  if (!localStorage.getItem("token")) {
  return <Navigate to="/" />;
}

  const validate = () => {
    let temp = {};

    if (!formData.name) temp.name = "Name is required";
    if (!formData.dob) temp.dob = "Date of birth is required";
    if (!formData.gender) temp.gender = "Gender is required";
    if (!formData.category) temp.category = "Category is required";
    if (!formData.income) temp.income = "Annual income is required";
    if (!formData.education) temp.education = "Education level is required";
    if (!formData.marks) temp.marks = "Marks / CGPA is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (validate()) {
    try {
      const res = await API.post("/eligibility/check", {
        income: formData.income,
        marks: formData.marks,
        category: formData.category,
      });

      localStorage.setItem(
        "eligibilityResult",
        JSON.stringify(res.data)
      );

      navigate("/result");
    } catch (error) {
      alert("Eligibility check failed");
    }
  }
};
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
          <button
            className="btn-outline"
            onClick={() => navigate("/scholarships")}
            style={{
              width: "auto",
              marginBottom: "20px",
              padding: "8px 15px",
              fontSize: "14px",
              background: "rgba(255, 255, 255, 0.4)",
              color: "#1e3a8a",
              fontWeight: "600"
            }}
          >
            &larr; Back to Scholarships
          </button>

          <h1 style={titleStyle}>Check Scholarship Eligibility</h1>
          <p style={{ textAlign: "center", marginBottom: "30px", color: "#1e3a8a", opacity: 0.8 }}>
            Enter your details to find eligible scholarships
          </p>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "30px" }}>
            {role === "admin" && (
              <>
                <button
                  className="btn-outline"
                  onClick={() => navigate("/admin/add-scholarship")}
                  style={{ width: "auto" }}
                >
                  Go to Admin Panel
                </button>
                <button
                  className="btn-outline"
                  onClick={() => navigate("/admin/scholarships")}
                  style={{ width: "auto" }}
                >
                  View Scholarships
                </button>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} style={formGrid}>
            {/* Name */}
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            {/* DOB */}
            <div className="input-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
              />
              {errors.dob && <div className="error-text">{errors.dob}</div>}
            </div>

            {/* Gender */}
            <div className="input-group">
              <label>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && <div className="error-text">{errors.gender}</div>}
            </div>

            {/* Category */}
            <div className="input-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select</option>
                <option>SC</option>
                <option>ST</option>
                <option>OBC</option>
                <option>General</option>
              </select>
              {errors.category && (
                <div className="error-text">{errors.category}</div>
              )}
            </div>

            {/* Income */}
            <div className="input-group">
              <label>Annual Family Income (₹)</label>
              <input
                type="number"
                value={formData.income}
                onChange={(e) =>
                  setFormData({ ...formData, income: e.target.value })
                }
              />
              {errors.income && <div className="error-text">{errors.income}</div>}
            </div>

            {/* Education */}
            <div className="input-group">
              <label>Education Level</label>
              <select
                value={formData.education}
                onChange={(e) =>
                  setFormData({ ...formData, education: e.target.value })
                }
              >
                <option value="">Select</option>
                <option>High School</option>
                <option>Diploma</option>
                <option>Undergraduate</option>
                <option>Postgraduate</option>
              </select>
              {errors.education && (
                <div className="error-text">{errors.education}</div>
              )}
            </div>

            {/* Marks */}
            <div className="input-group">
              <label>Marks / CGPA</label>
              <input
                type="number"
                step="0.01"
                value={formData.marks}
                onChange={(e) =>
                  setFormData({ ...formData, marks: e.target.value })
                }
              />
              {errors.marks && <div className="error-text">{errors.marks}</div>}
            </div>

            {/* Disability */}
            <div className="input-group">
              <label>Disability</label>
              <select
                value={formData.disability}
                onChange={(e) =>
                  setFormData({ ...formData, disability: e.target.value })
                }
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div style={{ gridColumn: "span 2", textAlign: "center", marginTop: "20px" }}>
              <button type="submit" className="btn-primary" style={{ padding: "12px 40px", width: "auto" }}>
                Check Eligibility
              </button>
            </div>
          </form>
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
  borderRadius: "20px",
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255,255,255,0.25)",
  boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
  maxHeight: "85vh",
  overflowY: "auto"
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "10px",
  color: "#1e3a8a",
  fontWeight: "600",
  fontSize: "28px"
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "20px",
  maxWidth: "800px",
  margin: "0 auto"
};

export default EligibilityForm;
