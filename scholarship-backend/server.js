const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Store io instance on app
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected to socket:", socket.id);

  socket.on("join_room", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`Socket ${socket.id} joined user room: ${userId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/eligibility", require("./routes/eligibilityRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
