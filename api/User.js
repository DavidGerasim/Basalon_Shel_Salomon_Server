const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("./../auth"); // ייבוא פונקציית יצירת ה-JWT

// Helper Functions

// Validate input fields
const validateSignUpInputs = ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  phoneNumber,
  address,
  mainInstrument,
}) => {
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !phoneNumber ||
    !address ||
    !mainInstrument
  ) {
    return "Empty input fields!";
  }

  // Validate name fields
  if (!/^[a-zA-Z ]*$/.test(firstName) || !/^[a-zA-Z ]*$/.test(lastName)) {
    return "Invalid name entered";
  }

  // Validate email format
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return "Invalid email entered";
  }

  // Validate password length and match
  if (password.length < 8) {
    return "Password is too short!";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match!";
  }

  // Validate phone number (simple check for numbers and length)
  if (!/^\d{10,15}$/.test(phoneNumber)) {
    return "Invalid phone number!";
  }

  // Validate address structure
  if (
    !address ||
    !address.description ||
    !address.latitude ||
    !address.longitude
  ) {
    return "Invalid address entered!";
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
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phoneNumber,
    mainInstrument,
    address,
  } = req.body;

  console.log(req.body);

  // Input Validation
  const validationError = validateSignUpInputs({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phoneNumber,
    address,
    mainInstrument,
  });
  if (validationError) return handleError(res, validationError);

  try {
    // Check if user exists
    const existingUser = await userExists(email);
    if (existingUser)
      return handleError(res, "User with the provided email already exists");

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user instance
    const newUser = new User({
      firstName: `${firstName}`, // Combine first and last name
      lastName: `${lastName}`,
      email: email,
      password: hashedPassword,
      phoneNumber,
      address,
      mainInstrument,
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

  if (!email || !password)
    return handleError(res, "Empty credentials supplied");

  try {
    const user = await userExists(email);
    if (!user) return handleError(res, "Invalid credentials entered!");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return handleError(res, "Invalid password entered!");

    const token = generateToken(user._id);
    res.json({ status: "SUCCESS", message: "Signin successful", token });
  } catch (error) {
    console.error("Error during signin: ", error);
    handleError(res, "An error occurred during signin");
  }
});

module.exports = router;
