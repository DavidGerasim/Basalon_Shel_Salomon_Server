const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");

// Helper Functions

// Validate input fields
const validateSignUpInputs = ({ name, email, password, dateOfBirth }) => {
  if (!name || !email || !password || !dateOfBirth) {
    return "Empty input fields!";
  }
  if (!/^[a-zA-Z ]*$/.test(name)) {
    return "Invalid name entered";
  }
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return "Invalid email entered";
  }
  if (isNaN(new Date(dateOfBirth).getTime())) {
    return "Invalid date of birth entered";
  }
  if (password.length < 8) {
    return "Password is too short!";
  }
  return null;
};

// Handle errors centrally
const handleError = (res, message, status = "FAILED") => {
  res.json({ status, message });
};

// Hash password
const hashPassword = (password) => bcrypt.hash(password, 10);

// Check if user already exists
const userExists = (email) => User.findOne({ email });

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password, dateOfBirth, location } = req.body;

  // Input Validation
  const validationError = validateSignUpInputs({ name, email, password, dateOfBirth });
  if (validationError) return handleError(res, validationError);

  try {
    // Check if user exists
    const existingUser = await userExists(email);
    if (existingUser) return handleError(res, "User with the provided email already exists");

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      location,  // Now includes location
    });

    // Save the user to the database
    await newUser.save();
    res.json({ status: "SUCCESS", message: "Signup successful" });
  } catch (error) {
    console.error("Error during signup: ", error);
    handleError(res, "An error occurred while creating the account");
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) return handleError(res, "Empty credentials supplied");

  try {
    // Check if user exists
    const user = await userExists(email);
    if (!user) return handleError(res, "Invalid credentials entered!");

    // Compare passwords
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) return handleError(res, "Invalid password entered!");

    // Successful login
    res.json({ status: "SUCCESS", message: "Signin successful", data: user });
  } catch (error) {
    console.error("Error during signin: ", error);
    handleError(res, "An error occurred during signin");
  }
});

module.exports = router;
