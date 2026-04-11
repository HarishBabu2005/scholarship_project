import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";

const documentCategories = {
  Personal: [
    "Aadhar Card",
    "Student Photo",
    "Smart Card"
  ],

  Academics: [
    "10th Marksheet",
    "12th Marksheet",
    "Transfer Certificate",
    "Recent Attested Marksheet"
  ],

  "Government Certificates": [
    "Income Certificate",
    "Nativity Certificate",
    "Community Certificate"
  ],

  "Bank Details": [
    "Bank Passbook",
    "Aadhar Seeding Proof"
  ]
};

function DocumentUpload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (docName, file) => {
    setError("");
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError(`Error in ${docName}: Only PDF files are allowed.`);
      return;
    }
    if (file.size > 300 * 1024) {
      setError(`Error in ${docName}: File size must be within 300KB.`);
      return;
    }
    setFiles({ ...files, [docName]: file });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("eligibilityResult");
    navigate("/");
  };

  const handleSubmit = async () => {
    if (error) {
      alert("Please fix the errors before submitting.");
      return;
    }

    const fileKeys = Object.keys(files);
    if (fileKeys.length === 0) {
      alert("Please upload at least one document.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      fileKeys.forEach((docName) => {
        formData.append(docName, files[docName]);
      });

      await API.post("/student/submit-documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Documents submitted successfully for admin verification!");
      navigate("/scholarships");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit documents");
    } finally {
      setSubmitting(false);
    }
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
          <h2 style={title}>Scholarship Document Upload</h2>
          
          {error && (
            <div style={{ 
              background: "rgba(255, 77, 79, 0.2)", 
              color: "#ff4d4f", 
              padding: "10px", 
              borderRadius: "8px", 
              marginBottom: "20px",
              textAlign: "center",
              border: "1px solid #ff4d4f"
            }}>
              {error}
            </div>
          )}

          {Object.keys(documentCategories).map((category) => (
            <div key={category} style={categoryBox}>
              <h3 style={categoryTitle}>{category}</h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...th, width: "8%" }}>S.No</th>
                    <th style={{ ...th, width: "42%" }}>Document Name</th>
                    <th style={{ ...th, width: "20%" }}>Status</th>
                    <th style={{ ...th, width: "30%" }}>Upload</th>
                  </tr>
                </thead>
                <tbody>
                  {documentCategories[category].map((doc, index) => (
                    <tr key={doc} style={rowStyle}>
                      <td style={td}>{index + 1}</td>
                      <td style={td}>{doc}</td>
                      <td style={td}>
                        {files[doc]
                          ? <span style={{ color: "#00c97f", fontWeight: "500" }}>Uploaded</span>
                          : <span style={{ color: "#ff4d4f", fontWeight: "500" }}>Not Uploaded</span>}
                      </td>
                      <td style={td}>
                        <input
                          type="file"
                          accept=".pdf"
                          style={fileInput}
                          onChange={(e) =>
                            handleFileChange(doc, e.target.files[0])
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "35px" }}>
            <button 
              onClick={handleSubmit} 
              style={{
                ...buttonStyle,
                opacity: (error || submitting) ? 0.6 : 1,
                cursor: (error || submitting) ? "not-allowed" : "pointer"
              }}
              disabled={!!error || submitting}
            >
              {submitting ? "Submitting..." : "Submit Documents"}
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
  borderRadius: "20px",
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255,255,255,0.25)",
  boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
  maxHeight: "85vh",
  overflowY: "auto"
};

const title = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#1e3a8a",
  fontWeight: "600"
};

const categoryBox = {
  marginTop: "25px"
};

const categoryTitle = {
  marginBottom: "12px",
  color: "#1e40af"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed"
};

const th = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid rgba(255,255,255,0.4)",
  color: "#1f2937"
};

const td = {
  padding: "12px",
  borderBottom: "1px solid rgba(255,255,255,0.2)"
};

const rowStyle = {
  transition: "background 0.3s"
};

const fileInput = {
  width: "100%",
  padding: "6px",
  background: "rgba(255,255,255,0.7)",
  borderRadius: "6px",
  border: "none"
};

const buttonStyle = {
  padding: "12px 35px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg,#3b82f6,#4f46e5)",
  color: "white",
  cursor: "pointer",
  fontWeight: "500"
};

export default DocumentUpload;