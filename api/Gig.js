const express = require("express");
const Gig = require("../models/Gig");
const User = require("../models/User");

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  next();
};

router.post("/", async (req, res) => {
  const {
    host,
    startTime,
    endTime,
    address,
    musiciansAllowed,
    friendsAllowed,
    instruments,
    comment,
  } = req.body;

  // לוג לכל הנתונים המתקבלים
  console.log("Received request to create Gig with data:", req.body);

  try {
    const userData = await User.findById(host);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    const newPost = new Gig({
      host,
      address,
      startTime,
      endTime,
      musiciansAllowed,
      friendsAllowed,
      instruments,
      comment,
    });

    await newPost.save();

    // לוג לפני שמירת הפגישה
    console.log("Gig created successfully:", newPost);
    res.status(201).json(newPost);
  } catch (error) {
    // לוג במקרה של שגיאה
    console.error("Error creating gig:", error);
    res.status(500).json({ message: "Error creating gig", error });
  }
});

// Route to get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Gig.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Gig.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Gig not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update a post by ID (protected)
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedPost = await Gig.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // TODO: check why new is true
    });
    // TODO: update users gigs array
   //  {
   //    userId,
   //    musiciansCount,
   //    friendsCount,
   //    instruments,
   //  }
    if (!updatedPost) return res.status(404).json({ message: "Gig not found" });
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a post by ID (protected)
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const deletedPost = await Gig.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: "Gig not found" });
    res.json({ message: "Gig deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// קבלת כל הפגישות של המשתמש לפי userId
router.get("/host/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log(`Fetching meetings for userId: ${userId}`);

  try {
    const meetings = await Gig.find({ host: userId });
    console.log("Meetings found:", meetings);
    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Error fetching meetings", error });
  }
});

// קבלת כל הפגישות שהמשתמש משתתף בהן (guesting)
router.get("/guest/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const gigs = await User.findById(userId).populate("gigs");

    if (!gigs.length) {
      return res.status(404).json({ message: "No guesting meetings found" });
    }

    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching guesting meetings:", error);
    res
      .status(500)
      .json({ message: "Error fetching guesting meetings", error });
  }
});

module.exports = router;
