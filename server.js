// server.js
require("./config/db");

const express = require("express");
const os = require("os");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const UserRouter = require("./api/User");
const PostRouter = require("./api/Post"); // הוספת ה-Router של הפוסטים

app.use(cors());
app.use(express.json());
app.use("/user", UserRouter);
app.use("/api/posts", PostRouter); // הוספת Route לפוסטים

// הגדרת Route לשליחת מיילים
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

app.listen(port, () => {
  const networkInterfaces = os.networkInterfaces();
  const ip =
    networkInterfaces["en0"]?.find((i) => i.family === "IPv4")?.address ||
    "localhost";
  console.log(`Server running at http://${ip}:${port}`);
});
