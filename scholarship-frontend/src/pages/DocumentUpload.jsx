import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";

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

  /* ✅ NEW CATEGORY ADDED */
  "Bank Details": [
    "Bank Passbook",
    "Aadhar Seeding Proof"
  ]
};

function DocumentUpload() {

  const [files, setFiles] = useState({});

  const handleFileChange = (docName, file) => {
    setFiles({
      ...files,
      [docName]: file
    });
  };

  const handleSubmit = () => {
    console.log(files);
    alert("Documents Selected Successfully!");
  };

  return (
    <AuthLayout>

      <div style={pageStyle}>

        <div style={glassCard}>

          <h2 style={title}>Scholarship Document Upload</h2>

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
                          accept=".pdf,.jpg,.png"
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
            <button onClick={handleSubmit} style={buttonStyle}>
              Submit Documents
            </button>
          </div>

        </div>

      </div>

    </AuthLayout>
  );
}

/* PAGE WRAPPER */
const pageStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "40px 20px"
};

/* GLASS CARD */
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

/* ✅ FIXED TABLE ALIGNMENT */
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

/* ✅ FULL WIDTH INPUT FOR ALIGNMENT */
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