import { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import AdminNavbar from "../components/AdminNavbar";
import API from "../api/axios";
import "../styles/theme.css";

function AdminApplicationManagement() {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [remarkInput, setRemarkInput] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/applications/admin/all?status=${filterStatus}`);
        setApplications(res.data);
        // Initialize remark input state
        const initialRemarks = {};
        res.data.forEach((app) => {
          initialRemarks[app._id] = app.adminRemarks || "";
        });
        setRemarkInput(initialRemarks);
      } catch (err) {
        console.error("Failed to fetch applications for admin", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [filterStatus]);


  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      const remarks = remarkInput[appId] || "";
      await API.put(`/applications/admin/status/${appId}`, {
        status: newStatus,
        adminRemarks: remarks,
      });

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus, adminRemarks: remarks } : app
        )
      );
      alert(`Application updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#10b981";
      case "Disbursed":
        return "#059669";
      case "Rejected":
        return "#ef4444";
      case "Under Review":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  };

  return (
    <AuthLayout>
      <div className="card" style={{ maxWidth: "1100px", width: "95%", textAlign: "left" }}>
        <AdminNavbar />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#1e3a8a" }}>Student Application Management</h2>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              Review, approve, reject, or disburse funds for student scholarship applications
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold", color: "#374151" }}>Filter Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                outline: "none",
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Disbursed">Disbursed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "30px" }}>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "30px" }}>No applications found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {applications.map((app) => (
              <div
                key={app._id}
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "#111827", fontSize: "16px" }}>
                      Scholarship: {app.scholarshipId?.name || "Unknown Scholarship"}
                    </h3>
                    <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#4b5563" }}>
                      <strong>Applicant:</strong> {app.studentId?.name || "Unknown Student"} ({app.studentId?.email})
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                      <strong>Award Amount:</strong> ₹{app.scholarshipId?.amount?.toLocaleString("en-IN")} |{" "}
                      <strong>Submitted:</strong> {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "16px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                        background: getStatusColor(app.status),
                      }}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <input
                      type="text"
                      placeholder="Add admin remarks/feedback..."
                      value={remarkInput[app._id] || ""}
                      onChange={(e) =>
                        setRemarkInput({ ...remarkInput, [app._id]: e.target.value })
                      }
                      style={{
                        flex: 1,
                        minWidth: "220px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        fontSize: "13px",
                      }}
                    />

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleStatusChange(app._id, "Under Review")}
                        disabled={updatingId === app._id}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "#f59e0b",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Under Review
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, "Approved")}
                        disabled={updatingId === app._id}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "#10b981",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, "Disbursed")}
                        disabled={updatingId === app._id}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "#059669",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Mark Disbursed
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, "Rejected")}
                        disabled={updatingId === app._id}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default AdminApplicationManagement;
