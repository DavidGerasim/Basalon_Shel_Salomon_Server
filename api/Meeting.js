const express = require("express");
const Meeting = require("../models/Meeting"); // נניח שהמודל שלך נמצא בתיקייה models
const router = express.Router();

// יצירת פגישה חדשה
router.post("/", async (req, res) => {
  const {
    userId,
    city,
    latitude,
    longitude,
    date,
    beginningTime,
    endTime,
    musicians,
    friends,
    instruments,
    comment,
  } = req.body;

  // לוג לכל הנתונים המתקבלים
  console.log("Received request to create meeting with data:", req.body);

  try {
    const newMeeting = new Meeting({
      userId,
      city,
      latitude,
      longitude,
      date,
      beginningTime,
      endTime,
      musicians,
      friends,
      instruments,
      comment,
    });

    // לוג לפני שמירת הפגישה
    console.log("Saving new meeting:", newMeeting);

    await newMeeting.save();

    // לוג לאחר שמירת הפגישה
    console.log("Meeting created successfully:", newMeeting);
    res.status(201).json(newMeeting);
  } catch (error) {
    // לוג במקרה של שגיאה
    console.error("Error creating meeting:", error);
    res.status(500).json({ message: "Error creating meeting", error });
  }
});

// קבלת כל הפגישות של המשתמש לפי מייל
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

module.exports = router;
