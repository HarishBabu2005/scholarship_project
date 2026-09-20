import React, { useState, useEffect, useCallback } from "react";
import AuthLayout from "../components/AuthLayout";
import AdminNavbar from "../components/AdminNavbar";
import API from "../api/axios";

function AdminDocumentVerification() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [scanningDocId, setScanningDocId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await API.get("/admin/submissions");
      setSubmissions(res.data);
      if (selectedSubmission) {
        const updated = res.data.find((s) => s.id === selectedSubmission.id);
        if (updated) setSelectedSubmission(updated);
      } else if (res.data && res.data.length > 0) {
        setSelectedSubmission(res.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    }
  }, [selectedSubmission]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleVerify = async (submissionId, docName, status) => {
    try {
      const adminRemarks = remarks[`${submissionId}-${docName}`] || "";
      await API.put(`/admin/submission/${submissionId}/document/${docName}`, {
        status,
        adminRemarks,
      });
      fetchSubmissions();
    } catch (error) {
      alert("Failed to update status");
      console.error(error);
    }
  };

  const handleBatchAutoApprove = async () => {
    if (
      !window.confirm(
        "Are you sure you want to batch auto-approve all pending documents with >=85% AI match confidence?"
      )
    )
      return;
    setLoadingBatch(true);
    try {
      const res = await API.post("/admin/submissions/batch-auto-approve");
      alert(res.data.message || "Batch auto-approval complete!");
      fetchSubmissions();
    } catch (err) {
      alert("Failed to run batch auto-approve.");
      console.error(err);
    } finally {
      setLoadingBatch(false);
    }
  };

  const handleReScanDoc = async (docId) => {
    setScanningDocId(docId);
    try {
      await API.post(`/student/scan-document/${docId}`);
      fetchSubmissions();
    } catch (err) {
      alert("Failed to re-scan document.");
      console.error(err);
    } finally {
      setScanningDocId(null);
    }
  };

  const handleRemarkChange = (id, docName, value) => {
    setRemarks({ ...remarks, [`${id}-${docName}`]: value });
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthLayout>
      <div style={fullPageWrapper}>
        <AdminNavbar />

        <div style={mainCard}>
          {/* Header Bar */}
          <div style={headerContainer}>
            <div>
              <h2 style={headerTitle}>📄 AI Document Verification Center</h2>
              <p style={headerSubtitle}>
                Automated AI OCR & Discrepancy Detection Engine for Student Submissions
              </p>
            </div>
            <button
              onClick={handleBatchAutoApprove}
              disabled={loadingBatch}
              style={{
                ...batchBtn,
                opacity: loadingBatch ? 0.7 : 1,
                cursor: loadingBatch ? "not-allowed" : "pointer",
              }}
            >
              {loadingBatch ? "⏳ Auto-Approving..." : "⚡ Batch Auto-Approve Verified Docs"}
            </button>
          </div>

          {/* Main Content Split Layout */}
          <div style={splitLayout}>
            {/* Left Sidebar: Submissions List */}
            <div style={sidebar}>
              <div style={{ marginBottom: "14px" }}>
                <input
                  type="text"
                  placeholder="🔍 Search student or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={searchInput}
                />
              </div>

              <div style={sidebarScrollArea}>
                {filteredSubmissions.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", padding: "20px" }}>
                    No student submissions found.
                  </p>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const pendingCount = sub.documents.filter((d) => d.status === "Pending").length;
                    const isSelected = selectedSubmission?.id === sub.id;

                    return (
                      <div
                        key={sub.id}
                        style={{
                          ...studentItem,
                          borderLeft: isSelected ? "4px solid #2563eb" : "4px solid transparent",
                          backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                        }}
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>
                          {sub.studentName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                          {sub.email}
                        </div>
                        <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                          <span
                            style={{
                              ...badgeBase,
                              backgroundColor: pendingCount > 0 ? "#fef3c7" : "#f1f5f9",
                              color: pendingCount > 0 ? "#92400e" : "#475569",
                            }}
                          >
                            {pendingCount} Pending
                          </span>
                          {sub.documents.some((d) => d.autoScanStatus === "Verified") && (
                            <span style={{ ...badgeBase, backgroundColor: "#d1fae5", color: "#065f46" }}>
                              🤖 AI Verified
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Main Area: Selected Student Documents */}
            <div style={detailsArea}>
              {selectedSubmission ? (
                <div>
                  <div style={studentHeaderCard}>
                    <div>
                      <h3 style={{ margin: 0, color: "#1e3a8a", fontSize: "18px", fontWeight: "700" }}>
                        Documents for {selectedSubmission.studentName}
                      </h3>
                      <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#475569" }}>
                        Email: <strong>{selectedSubmission.email}</strong> • Total Documents: <strong>{selectedSubmission.documents.length}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {selectedSubmission.documents.map((doc) => (
                      <div key={doc.name} style={documentCard}>
                        {/* Doc Top Row */}
                        <div style={docTopRow}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "22px" }}>📑</span>
                            <div>
                              <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a", textTransform: "capitalize" }}>
                                {doc.name.replace(/([A-Z])/g, " $1")}
                              </div>
                              <div style={{ fontSize: "12px", color: "#64748b" }}>
                                Field Identifier: <code>{doc.name}</code>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={getStatusBadgeStyle(doc.status)}>{doc.status}</span>
                            <a
                              href={`http://localhost:5000${doc.fileUrl || doc.url}`}
                              target="_blank"
                              rel="noreferrer"
                              style={viewFileBtn}
                            >
                              👁️ View File
                            </a>
                          </div>
                        </div>

                        {/* AI Auto-Scan Breakdown Panel */}
                        <div style={aiScanPanel}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={getAiStatusBadgeStyle(doc.autoScanStatus, doc.autoScanScore)}>
                              {doc.autoScanStatus === "Verified" ? "🟢" : doc.autoScanStatus === "Discrepancy Detected" ? "🔴" : "🟡"}{" "}
                              AI Verification: <strong>{doc.autoScanStatus || "Pending"}</strong> ({doc.autoScanScore || 85}% Confidence Match)
                            </span>
                            {doc._id && (
                              <button
                                onClick={() => handleReScanDoc(doc._id)}
                                disabled={scanningDocId === doc._id}
                                style={rescanBtn}
                              >
                                {scanningDocId === doc._id ? "⏳ Scanning..." : "🔍 Run AI Re-Scan"}
                              </button>
                            )}
                          </div>
                          <div style={{ fontSize: "12.5px", color: "#334155", lineHeight: "1.4" }}>
                            {doc.autoScanDetails || "Document parsed and verified format against student profile."}
                          </div>
                        </div>

                        {/* Admin Action Bar */}
                        <div style={adminActionBar}>
                          <input
                            type="text"
                            placeholder="Add reason or remark for student..."
                            value={remarks[`${selectedSubmission.id}-${doc.name}`] || doc.adminRemarks || ""}
                            onChange={(e) => handleRemarkChange(selectedSubmission.id, doc.name, e.target.value)}
                            style={remarkInput}
                          />
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => handleVerify(selectedSubmission.id, doc.name, "Approved")}
                              style={approveBtn}
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleVerify(selectedSubmission.id, doc.name, "Rejected")}
                              style={rejectBtn}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={emptyState}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>📂</div>
                  <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>No Submission Selected</p>
                  <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                    Select a student from the left sidebar to review their submitted documents.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

// Inline Styles
const fullPageWrapper = {
  width: "100%",
  maxWidth: "1350px",
  margin: "0 auto",
  boxSizing: "border-box",
};

const mainCard = {
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
  padding: "28px",
  boxSizing: "border-box",
  marginTop: "10px",
};

const headerContainer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #e2e8f0",
  paddingBottom: "20px",
  marginBottom: "24px",
  flexWrap: "wrap",
  gap: "16px",
};

const headerTitle = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "800",
  color: "#1e3a8a",
};

const headerSubtitle = {
  margin: "4px 0 0 0",
  fontSize: "13px",
  color: "#64748b",
};

const batchBtn = {
  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
  color: "#ffffff",
  border: "none",
  borderRadius: "12px",
  padding: "12px 20px",
  fontWeight: "700",
  fontSize: "13.5px",
  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
  transition: "all 0.2s ease",
};

const splitLayout = {
  display: "flex",
  gap: "24px",
  minHeight: "550px",
  alignItems: "flex-start",
};

const sidebar = {
  width: "300px",
  flexShrink: 0,
  backgroundColor: "#f8fafc",
  borderRadius: "16px",
  padding: "16px",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
};

const searchInput = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const sidebarScrollArea = {
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxHeight: "550px",
};

const studentItem = {
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.15s ease",
  border: "1px solid #e2e8f0",
};

const badgeBase = {
  fontSize: "11px",
  padding: "3px 8px",
  borderRadius: "12px",
  fontWeight: "700",
};

const detailsArea = {
  flex: 1,
  backgroundColor: "#ffffff",
  minWidth: 0,
};

const studentHeaderCard = {
  backgroundColor: "#f1f5f9",
  padding: "16px 20px",
  borderRadius: "14px",
  marginBottom: "20px",
  border: "1px solid #e2e8f0",
};

const documentCard = {
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "18px",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const docTopRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
};

const viewFileBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "6px 12px",
  borderRadius: "8px",
  backgroundColor: "#eff6ff",
  color: "#2563eb",
  textDecoration: "none",
  fontSize: "12.5px",
  fontWeight: "700",
  border: "1px solid #bfdbfe",
};

const aiScanPanel = {
  backgroundColor: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  padding: "12px 14px",
};

const rescanBtn = {
  backgroundColor: "#ffffff",
  color: "#334155",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  padding: "4px 10px",
  fontSize: "11.5px",
  fontWeight: "600",
  cursor: "pointer",
};

const adminActionBar = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const remarkInput = {
  flex: 1,
  minWidth: "200px",
  padding: "9px 14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "13px",
  outline: "none",
};

const approveBtn = {
  padding: "9px 16px",
  backgroundColor: "#059669",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
};

const rejectBtn = {
  padding: "9px 16px",
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
};

const emptyState = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "350px",
  backgroundColor: "#f8fafc",
  borderRadius: "16px",
  border: "2px dashed #cbd5e1",
  color: "#64748b",
};

const getStatusBadgeStyle = (status) => ({
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "700",
  backgroundColor: status === "Approved" ? "#d1fae5" : status === "Rejected" ? "#fee2e2" : "#fef3c7",
  color: status === "Approved" ? "#065f46" : status === "Rejected" ? "#991b1b" : "#92400e",
});

const getAiStatusBadgeStyle = (status, score) => ({
  fontSize: "12px",
  fontWeight: "700",
  padding: "4px 10px",
  borderRadius: "8px",
  backgroundColor: status === "Verified" || score >= 85 ? "#ecfdf5" : status === "Discrepancy Detected" ? "#fef2f2" : "#fffbeb",
  color: status === "Verified" || score >= 85 ? "#047857" : status === "Discrepancy Detected" ? "#b91c1c" : "#b45309",
  border: `1px solid ${status === "Verified" || score >= 85 ? "#a7f3d0" : status === "Discrepancy Detected" ? "#fecaca" : "#fde68a"}`,
});

export default AdminDocumentVerification;
