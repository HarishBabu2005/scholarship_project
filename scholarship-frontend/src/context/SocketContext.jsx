import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toastData) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toastData };
    setToasts((prev) => [newToast, ...prev]);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  }, [removeToast]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Helper to decode JWT payload safely
    let userId = null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
    } catch (e) {
      console.error("Error decoding token for socket user id", e);
    }

    // Connect socket
    const backendUrl = process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace("/api", "")
      : "http://localhost:5000";

    const newSocket = io(backendUrl, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("⚡ Real-time Socket connected:", newSocket.id);
      if (userId) {
        newSocket.emit("join_room", userId);
      }
    });

    // Handle real-time notification events
    newSocket.on("notification", (data) => {
      console.log("🔔 Real-time notification received:", data);
      addToast(data);
      setUnreadCount((prev) => prev + 1);
    });

    // Handle new scholarship broadcast
    newSocket.on("new_scholarship", (data) => {
      console.log("📢 New scholarship alert:", data);
      addToast({
        title: "✨ " + data.title,
        message: data.message,
        type: "info",
      });
      setUnreadCount((prev) => prev + 1);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [addToast]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        toasts,
        addToast,
        removeToast,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
