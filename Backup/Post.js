const express = require("express");
const Post = require("../models/Post"); // ודא שהנתיב נכון לקובץ המודל

const router = express.Router();

// Route ליצירת פוסט חדש
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body); // קח את כל הנתונים מהבקשה
    await newPost.save(); // שמור את הפוסט
    res.status(201).json(newPost); // החזר תשובה עם הפוסט שנשמר
  } catch (error) {
    res.status(400).json({ message: error.message }); // החזר שגיאה אם שמירת הפוסט נכשלה
  }
});

// Route לקבלת כל הפוסטים
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find(); // קח את כל הפוסטים
    res.json(posts); // החזר את הפוסטים
  } catch (error) {
    res.status(500).json({ message: error.message }); // החזר שגיאה אם קבלת הפוסטים נכשלה
  }
});

// Route לקבלת פוסט לפי ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // קח את הפוסט לפי ID
    if (!post) return res.status(404).json({ message: "Post not found" }); // החזר שגיאה אם הפוסט לא נמצא
    res.json(post); // החזר את הפוסט
  } catch (error) {
    res.status(500).json({ message: error.message }); // החזר שגיאה אם קבלת הפוסט נכשלה
  }
});

// Route לעדכון פוסט לפי ID
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }); // עדכן את הפוסט
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" }); // החזר שגיאה אם הפוסט לא נמצא
    res.json(updatedPost); // החזר את הפוסט המעודכן
  } catch (error) {
    res.status(400).json({ message: error.message }); // החזר שגיאה אם עדכון הפוסט נכשלה
  }
});

// Route למחיקת פוסט לפי ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id); // מחוק את הפוסט
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" }); // החזר שגיאה אם הפוסט לא נמצא
    res.json({ message: "Post deleted" }); // החזר הודעה שהפוסט נמחק
  } catch (error) {
    res.status(500).json({ message: error.message }); // החזר שגיאה אם מחיקת הפוסט נכשלה
  }
});

module.exports = router; // ייצא את ה-Router
