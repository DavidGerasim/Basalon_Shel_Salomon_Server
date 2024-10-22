const express = require("express");
const Meeting = require("../models/Meeting");
const Post = require("../models/Post");
const router = express.Router();


// קבלת כל הפגישות של המשתמש לפי userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log(`Fetching meetings for userId: ${userId}`);

  try {
    const meetings = await Meeting.find({ userId });
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
    const meetings = await Meeting.find({ userId: userId });

    if (!meetings.length) {
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

// קבלת כל הפגישות שבהן משתמש אחר קבע פגישה אצלי
router.get("/host/:userPost", async (req, res) => {
   const { userPost } = req.params;
 
   try {
     const meetings = await Meeting.find({ userPost: userPost });
 
     if (!meetings.length) {
       return res.status(404).json({ message: "No scheduled meetings found" });
     }
 
     res.status(200).json(meetings);
   } catch (error) {
     console.error("Error fetching scheduled meetings:", error);
     res.status(500).json({ message: "Error fetching scheduled meetings", error });
   }
 }); 

module.exports = router;
