require("./config/db"); // Ensure the database connection is established

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const UserRouter = require("./api/User");

app.use(express.json()); // Middleware to parse JSON bodies

app.use("/user", UserRouter); // Mount the UserRouter at /user

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
