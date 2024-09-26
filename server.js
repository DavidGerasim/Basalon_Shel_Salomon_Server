require("./config/db");

const express = require("express");
const os = require("os");
const app = express();
const port = process.env.PORT || 3000;

const UserRouter = require("./api/User");

app.use(express.json());
app.use("/user", UserRouter);

app.listen(port, () => {
  const networkInterfaces = os.networkInterfaces();
  const ip = networkInterfaces['en0']?.find(i => i.family === 'IPv4')?.address || 'localhost';
  console.log(`Server running at http://${ip}:${port}`);
});

