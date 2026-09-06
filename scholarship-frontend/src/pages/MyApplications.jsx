import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";

function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/my-applications");
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#10b981"; // Emerald
      case "Disbursed":
        return "#059669"; // Dark Emerald
      case "Rejected":
        return "#ef4444"; // Red
      case "Under Review":
        return "#f59e0b"; // Amber
      default:
        return "#3b82f6"; // Blue
    }
  };

  const statusSteps = ["Submitted", "Under Review", "Approved", "Disbursed"];

  const getStepIndex = (status) => {
    if (status === "Rejected") return -1;
    return statusSteps.indexOf(status);
  };

  return (
    <AuthLayout>
      <div
        className="card result-card"
        style={{ maxWidth: "1000px", width: "95%", textAlign: "left" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <button
              className="btn-outline"
              onClick={() => navigate("/scholarships")}
              style={{ width: "auto", padding: "6px 15px", fontSize: "14px", marginBottom: "10px" }}
            >
              &larr; Back to Scholarships
            </button>
            <h1 style={{ margin: 0 }}>My Scholarship Applications</h1>
            <p style={{ margin: 0, color: "#6b7280" }}>Track live status and disbursal progress</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate("/scholarships")}
            style={{ width: "auto", padding: "10px 20px" }}
          >
            Explore More Scholarships
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>Loading your applications...</p>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "rgba(255,255,255,0.6)", borderRadius: "16px" }}>
            <h3>No Applications Submitted Yet</h3>
            <p style={{ color: "#6b7280" }}>You have not applied for any scholarships yet.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/scholarships")}
              style={{ width: "auto", marginTop: "10px" }}
            >
              Browse Available Scholarships
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {applications.map((app) => {
              const currentStepIdx = getStepIndex(app.status);
              const isRejected = app.status === "Rejected";

              return (
                <div
                  key={app._id}
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 5px 0", color: "#1e3a8a", fontSize: "18px" }}>
                        {app.scholarshipId ? app.scholarshipId.name : "Scholarship Application"}
                      </h3>
                      <p style={{ margin: 0, fontSize: "14px", color: "#4b5563" }}>
                        <strong>Provider:</strong> {app.scholarshipId?.provider || "N/A"} |{" "}
                        <strong>Award Amount:</strong> ₹{app.scholarshipId?.amount?.toLocaleString("en-IN") || "N/A"}
                      </p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                        Submitted on: {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "13px",
                        background: getStatusColor(app.status),
                      }}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Status Timeline Progress Stepper */}
                  <div style={{ marginTop: "25px", marginBottom: "15px" }}>
                    {isRejected ? (
                      <div
                        style={{
                          padding: "12px 16px",
                          background: "#fee2e2",
                          borderLeft: "4px solid #ef4444",
                          borderRadius: "8px",
                          color: "#991b1b",
                          fontSize: "14px",
                        }}
                      >
                        <strong>Application Status: Rejected</strong>
                        {app.adminRemarks && <div>Remarks: {app.adminRemarks}</div>}
                      </div>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                        {/* Connecting line */}
                        <div
                          style={{
                            position: "absolute",
                            top: "14px",
                            left: "10%",
                            right: "10%",
                            height: "4px",
                            background: "#e5e7eb",
                            zIndex: 1,
                          }}
                        />
                        {/* Active line fill */}
                        <div
                          style={{
                            position: "absolute",
                            top: "14px",
                            left: "10%",
                            width: `${(currentStepIdx / (statusSteps.length - 1)) * 80}%`,
                            height: "4px",
                            background: "#10b981",
                            zIndex: 2,
                            transition: "width 0.3s ease",
                          }}
                        />

                        {statusSteps.map((step, idx) => {
                          const isCompleted = currentStepIdx >= idx;
                          const isCurrent = currentStepIdx === idx;

                          return (
                            <div
                              key={step}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                zIndex: 3,
                                width: "25%",
                              }}
                            >
                              <div
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  background: isCompleted ? "#10b981" : "#ffffff",
                                  border: `3px solid ${isCompleted ? "#10b981" : "#d1d5db"}`,
                                  color: isCompleted ? "white" : "#6b7280",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  boxShadow: isCurrent ? "0 0 0 4px rgba(16, 185, 129, 0.2)" : "none",
                                }}
                              >
                                {isCompleted ? "✓" : idx + 1}
                              </div>
                              <span
                                style={{
                                  fontSize: "12px",
                                  marginTop: "8px",
                                  fontWeight: isCurrent || isCompleted ? "bold" : "normal",
                                  color: isCompleted ? "#065f46" : "#6b7280",
                                  textAlign: "center",
                                }}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {app.adminRemarks && !isRejected && (
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "10px 14px",
                        background: "#f3f4f6",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#374151",
                      }}
                    >
                      <strong>Admin Remarks:</strong> {app.adminRemarks}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default MyApplications;
