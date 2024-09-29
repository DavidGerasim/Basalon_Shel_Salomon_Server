require("./config/db");

const express = require("express");
const os = require("os");
const nodemailer = require("nodemailer");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const Post = require("./models/Post"); // Ensure correct path to Post model

const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server for Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Routers
const UserRouter = require("./api/User");
const PostRouter = require("./api/Post");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/user", UserRouter);
app.use("/api/posts", PostRouter); // Adding the route for posts

// Email sending route (Password reset)
app.post("/api/send-password-reset", async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tuzdavid@gmail.com",
      pass: "bre2kd2nce",
    },
  });

  const mailOptions = {
    from: "tuzdavid@gmail.com",
    to: email,
    subject: "Password Reset",
    text: "Click the link to reset your password.",
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// MongoDB Change Stream to watch changes in the Post collection
const postChangeStream = Post.watch(); // Watch for changes in the Post collection
postChangeStream.on("change", (change) => {
  console.log("Post change detected:", change);
  io.emit("postUpdated", change); // Emit the post update event to all connected clients
});

// Setup Socket.IO to listen for client connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server with both HTTP and WebSocket functionality
server.listen(port, () => {
  const networkInterfaces = os.networkInterfaces();
  const ip =
    networkInterfaces["en0"]?.find((i) => i.family === "IPv4")?.address ||
    "localhost";
  console.log(`Server running at http://${ip}:${port}`);
});
