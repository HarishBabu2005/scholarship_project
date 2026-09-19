import React from "react";
import { useSocket } from "../context/SocketContext";

const NotificationToast = () => {
  const { toasts, removeToast } = useSocket();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "380px",
        width: "90%",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "14px",
            padding: "16px 20px",
            color: "white",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            animation: "slideIn 0.3s ease-out forwards",
          }}
        >
          <div style={{ flex: 1, paddingRight: "10px" }}>
            <h4
              style={{
                margin: "0 0 4px 0",
                fontSize: "14px",
                fontWeight: "700",
                color: "#60a5fa",
              }}
            >
              {toast.title || "Real-Time Update"}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#cbd5e1",
                lineHeight: "1.4",
              }}
            >
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              fontSize: "16px",
              cursor: "pointer",
              padding: "0",
              lineHeight: "1",
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
