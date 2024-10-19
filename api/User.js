const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // JWT module

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

// Hash password
const hashPassword = (password) => bcrypt.hash(password, 10);

// Check if user already exists
const userExists = (email) => User.findOne({ email });
const phoneNumberExists = (phoneNumber) => User.findOne({ phoneNumber });

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

  console.log("Signup request received:", req.body); // Log signup request

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
  if (validationError) {
    console.log("Validation error:", validationError); // Log validation error
    return res.status(400).json({ message: validationError });
  }

  try {
    // Check if user exists
    const existingUser = await userExists(email);
    if (existingUser) {
      console.log("User already exists:", existingUser); // Log existing user
      return res
        .status(400)
        .json({ message: "User with the provided email already exists" });
    }

    // Check if phone number exists
    const existingPhoneNumber = await phoneNumberExists(phoneNumber);
    if (existingPhoneNumber) {
      console.log("Phone number already exists:", existingPhoneNumber); // Log existing phone number
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    console.log("Password hashed successfully"); // Log password hash success

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      mainInstrument,
    });

    // Save the user to the database
    await newUser.save();
    console.log("New user saved:", newUser); // Log new user save

    // Create a JWT token
    const token = jwt.sign({ userId: newUser._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    console.log("JWT token created:", token); // Log JWT token creation

    // Save user ID in session
    req.session.userId = newUser._id;

    res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    console.error("Error during signup: ", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the account" });
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  console.log("Signin request received:", req.body); // Log signin request

  if (!email || !password) {
    console.log("Empty credentials supplied"); // Log empty credentials
    return res.status(400).json({ message: "Empty credentials supplied" });
  }

  try {
    // Check if user exists
    const user = await userExists(email);
    if (!user) {
      console.log("Invalid credentials entered! User not found."); // Log user not found
      return res.status(400).json({ message: "Invalid credentials entered!" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password entered!"); // Log invalid password
      return res.status(400).json({ message: "Invalid password entered!" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    console.log("JWT token created:", token); // Log JWT token creation

    // Save user ID in session
    req.session.userId = user._id;

    // Return response with necessary info
    res.status(200).json({
      message: "Signin successful",
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    });
  } catch (error) {
    console.error("Error during signin: ", error);
    res.status(500).json({ message: "An error occurred during signin" });
  }
});

// User Profile Route
router.get("/profile", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from headers
  console.log("User profile request received. Token:", token); // Log token

  if (!token) {
    console.log("No token provided."); // Log missing token
    return res.status(403).json({ message: "Token is required!" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key"); // Verify token
    console.log("Decoded token:", decoded); // Log decoded token
    const userId = decoded.userId;

    // Fetch user data from database
    const user = await User.findById(userId).select("-password"); // Exclude password from response
    if (!user) {
      console.log("User not found for ID:", userId); // Log user not found
      return res.status(404).json({ message: "User not found!" });
    }

    // Return user profile data
    res.status(200).json({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      mainInstrument: user.mainInstrument,
    });
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching user profile" });
  }
});

// עדכון פרטי המשתמש
router.put("/profile", async (req, res) => {
  const { userId } = req.user; // נניח שהטוקן מכיל את userId
  const { phoneNumber, address, password, mainInstrument } = req.body;

  try {
    // חיפוש המשתמש לפי ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // עדכון הפרטים לפי מה שנשלח מהלקוח
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (password) user.password = await hashPassword(password); // קידוד סיסמה
    if (mainInstrument) user.mainInstrument = mainInstrument;

    await user.save(); // שמירת העדכונים

    res
      .status(200)
      .json({ message: "User details updated successfully", user });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Failed to update user details" });
  }
});

// Signout Route
router.post("/signout", (req, res) => {
  console.log("Signout request received"); // Log signout request
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to sign out:", err); // Log signout error
      return res.status(500).json({ message: "Failed to sign out" });
    }
    console.log("Signout successful"); // Log successful signout
    res.json({ message: "Signout successful" });
  });
});

module.exports = router;
