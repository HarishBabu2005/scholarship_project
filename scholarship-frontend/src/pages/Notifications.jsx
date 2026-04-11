import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../api/axios";
import "../styles/theme.css";

function Notifications() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("eligibilityResult");
    navigate("/");
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

      <div
        className="card result-card"
        style={{ maxWidth: "700px", width: "95%", textAlign: "left" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <h1 style={{ marginBottom: "5px" }}>Notifications</h1>
            <p style={{ marginBottom: 0, fontSize: "14px" }}>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>
          <button
            className="btn-outline"
            onClick={() => navigate("/scholarships")}
            style={{ width: "auto", padding: "8px 16px", fontSize: "13px" }}
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>Loading...</p>
        ) : notifications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#6b7280",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>🔔</div>
            <p style={{ fontSize: "16px", fontWeight: "500" }}>
              No notifications yet
            </p>
            <p style={{ fontSize: "13px" }}>
              You'll receive updates here when your documents are reviewed.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {notifications.map((n) => {
              const isApproved = n.title?.includes("Approved");
              const isRejected = n.title?.includes("Rejected");

              return (
                <div
                  key={n._id}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "14px",
                    background: n.isRead
                      ? "rgba(255,255,255,0.3)"
                      : isApproved
                      ? "rgba(34, 197, 94, 0.12)"
                      : isRejected
                      ? "rgba(239, 68, 68, 0.12)"
                      : "rgba(37, 99, 235, 0.1)",
                    border: n.isRead
                      ? "1px solid rgba(255,255,255,0.3)"
                      : isApproved
                      ? "1px solid rgba(34, 197, 94, 0.3)"
                      : isRejected
                      ? "1px solid rgba(239, 68, 68, 0.3)"
                      : "1px solid rgba(37, 99, 235, 0.25)",
                    position: "relative",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Unread dot */}
                  {!n.isRead && (
                    <div
                      style={{
                        position: "absolute",
                        top: "18px",
                        right: "16px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: isApproved
                          ? "#22c55e"
                          : isRejected
                          ? "#ef4444"
                          : "#3b82f6",
                      }}
                    />
                  )}

                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "15px",
                      color: isApproved
                        ? "#065f46"
                        : isRejected
                        ? "#991b1b"
                        : "#1e3a8a",
                      marginBottom: "6px",
                    }}
                  >
                    {isApproved ? "✅ " : isRejected ? "❌ " : "📋 "}
                    {n.title}
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      lineHeight: "1.5",
                      marginBottom: "10px",
                      paddingRight: "20px",
                    }}
                  >
                    {n.message}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{ fontSize: "12px", color: "#9ca3af" }}
                    >
                      {new Date(n.createdAt).toLocaleString()}
                    </span>

                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        style={{
                          padding: "4px 12px",
                          fontSize: "12px",
                          borderRadius: "8px",
                          border: "1px solid rgba(0,0,0,0.15)",
                          background: "rgba(255,255,255,0.6)",
                          color: "#374151",
                          cursor: "pointer",
                          fontWeight: "500",
                        }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default Notifications;
