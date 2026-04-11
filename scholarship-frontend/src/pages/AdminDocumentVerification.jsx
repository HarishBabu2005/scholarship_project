import React, { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import AdminNavbar from "../components/AdminNavbar";
import API from "../api/axios";

function AdminDocumentVerification() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [remarks, setRemarks] = useState({});

  const fetchSubmissions = async () => {
    try {
      const res = await API.get("/admin/submissions");
      setSubmissions(res.data);
      if (selectedSubmission) {
        const updated = res.data.find(s => s.id === selectedSubmission.id);
        if (updated) setSelectedSubmission(updated);
      }
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleVerify = async (submissionId, docName, status) => {
    try {
      const adminRemarks = remarks[`${submissionId}-${docName}`] || "";
      await API.put(`/admin/submission/${submissionId}/document/${docName}`, { status, adminRemarks });
      alert(`Document ${docName} ${status}!`);
      fetchSubmissions();
    } catch (error) {
      alert("Failed to update status");
      console.error(error);
    }
  };

  const handleRemarkChange = (id, docName, value) => {
    setRemarks({ ...remarks, [`${id}-${docName}`]: value });
  };

  return (
    <AuthLayout>
      <AdminNavbar />
      <div style={pageStyle}>
        <div style={glassCard}>
          <h2 style={title}>Document Verification Portal</h2>
          
          <div style={layoutContainer}>
            {/* Sidebar: Submission List */}
            <div style={sidebar}>
              <h3 style={sectionTitle}>Recent Submissions</h3>
              {submissions.map(sub => (
                <div 
                  key={sub.id} 
                  style={{...studentCard, borderLeft: selectedSubmission?.id === sub.id ? "5px solid #3b82f6" : "none"}}
                  onClick={() => setSelectedSubmission(sub)}
                >
                  <p style={{fontWeight: "600", margin: 0}}>{sub.studentName}</p>
                  <p style={{fontSize: "12px", color: "#666", margin: "4px 0"}}>{sub.email}</p>
                  <span style={pendingBadge}>
                    {sub.documents.filter(d => d.status === "Pending").length} Pending
                  </span>
                </div>
              ))}
            </div>

            {/* Main Content: Document Details */}
            <div style={mainContent}>
              {selectedSubmission ? (
                <div>
                  <h3 style={sectionTitle}>Documents for {selectedSubmission.studentName}</h3>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={th}>Document</th>
                        <th style={th}>Status</th>
                        <th style={th}>View</th>
                        <th style={th}>Remarks</th>
                        <th style={th}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSubmission.documents.map(doc => (
                        <tr key={doc.name} style={rowStyle}>
                          <td style={td}>{doc.name}</td>
                          <td style={td}>
                            <span style={getStatusStyle(doc.status)}>{doc.status}</span>
                          </td>
                          <td style={td}>
                            <a href={`http://localhost:5000${doc.fileUrl || doc.url}`} target="_blank" rel="noreferrer" style={viewLink}>View PDF</a>
                          </td>
                          <td style={td}>
                            <input 
                              type="text" 
                              placeholder="Add reason if rejecting..."
                              style={remarkInput}
                              value={remarks[`${selectedSubmission.id}-${doc.name}`] || ""}
                              onChange={(e) => handleRemarkChange(selectedSubmission.id, doc.name, e.target.value)}
                            />
                          </td>
                          <td style={td}>
                            <div style={actionButtons}>
                              <button 
                                onClick={() => handleVerify(selectedSubmission.id, doc.name, "Approved")}
                                style={approveBtn}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleVerify(selectedSubmission.id, doc.name, "Rejected")}
                                style={rejectBtn}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={emptyState}>
                  <p>Select a student from the left to review their documents.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

// Styles
const pageStyle = { width: "100%", padding: "40px 20px", marginTop: "80px" };
const glassCard = {
  maxWidth: "1200px", margin: "0 auto", padding: "40px",
  borderRadius: "20px", background: "rgba(255,255,255,0.2)",
  backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "0 15px 45px rgba(0,0,0,0.1)"
};
const title = { textAlign: "center", marginBottom: "40px", color: "#1e3a8a" };
const layoutContainer = { display: "flex", gap: "30px", minHeight: "500px" };
const sidebar = { flex: "1", background: "rgba(255,255,255,0.4)", borderRadius: "15px", padding: "20px", overflowY: "auto" };
const mainContent = { flex: "3", background: "rgba(255,255,255,0.6)", borderRadius: "15px", padding: "25px" };
const sectionTitle = { fontSize: "18px", marginBottom: "15px", color: "#1e40af" };
const studentCard = { 
  padding: "15px", marginBottom: "12px", background: "white", 
  borderRadius: "10px", cursor: "pointer", transition: "all 0.2s shadow",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
};
const pendingBadge = { fontSize: "11px", background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: "12px", fontWeight: "600" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const th = { textAlign: "left", padding: "12px", borderBottom: "2px solid #eee", color: "#4b5563" };
const td = { padding: "12px", borderBottom: "1px solid #eee" };
const rowStyle = { transition: "background 0.2s" };
const remarkInput = { padding: "6px 10px", borderRadius: "5px", border: "1px solid #ddd", width: "150px" };
const actionButtons = { display: "flex", gap: "8px" };
const approveBtn = { padding: "5px 12px", background: "#059669", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" };
const rejectBtn = { padding: "5px 12px", background: "#dc2626", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" };
const viewLink = { color: "#3b82f6", textDecoration: "none", fontWeight: "500" };
const emptyState = { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#666" };

const getStatusStyle = (status) => ({
  padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600",
  background: status === "Approved" ? "#d1fae5" : status === "Rejected" ? "#fee2e2" : "#fef3c7",
  color: status === "Approved" ? "#065f46" : status === "Rejected" ? "#991b1b" : "#92400e"
});

export default AdminDocumentVerification;
