require("./config/db");

const express = require("express");
const os = require("os");
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Post = require("./models/Post");
const UserRouter = require("./api/User");
const PostRouter = require("./api/Post");
const meetingRoutes = require("./api/Meeting");

const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server for Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to parse JSON
app.use(express.json());

// Setup session middleware
app.use(
  session({
    secret: "mySecretKey", // Change to a secure secret in production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/session_management", // MongoDB URL for storing sessions
      collectionName: "sessions", // MongoDB collection to store sessions
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day session expiration
    },
  })
);

// User Routes
app.use("/user", UserRouter);

// Post Routes with session check middleware
app.use("/api/posts", PostRouter);

app.use("/api/meetings", meetingRoutes);

// MongoDB Change Stream to watch changes in the Post collection
const postChangeStream = Post.watch();
postChangeStream.on("change", (change) => {
  console.log("Post change detected:", change);
  io.emit("postUpdated", change); // Emit the post update event to all connected clients
});

// Setup Socket.IO to listen for client connections
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(port, () => {
  const networkInterfaces = os.networkInterfaces();
  const ip =
    networkInterfaces["en0"]?.find((i) => i.family === "IPv4")?.address ||
    "localhost";
  console.log(`Server running at http://${ip}:${port}`);
});
