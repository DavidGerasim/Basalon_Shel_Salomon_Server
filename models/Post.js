const mongoose = require("mongoose");

// יצירת סכמת הפוסט
const postSchema = new mongoose.Schema({
  city: {
    type: Object,
    required: false, // שדה זה לא חובה
  },
  latitude: {
    type: Number, // קואורדינטות רוחב
    required: false, // שדה זה לא חובה
  },
  longitude: {
    type: Number, // קואורדינטות אורך
    required: false, // שדה זה לא חובה
  },
  date: {
    type: Date,
    required: false, // שדה זה לא חובה
  },
  beginningTime: {
    type: Date,
    required: false, // שדה זה לא חובה
  },
  endTime: {
    type: Date,
    required: false, // שדה זה לא חובה
  },
  musicians: {
    type: Number,
    required: false, // שדה זה לא חובה
  },
  friends: {
    type: Number,
    required: false, // שדה זה לא חובה
  },
  instruments: {
    type: String,
    required: false, // שדה זה לא חובה
  },
  comment: {
    type: String,
    required: false, // שדה זה לא חובה
  },
  createdAt: {
    type: Date,
    default: Date.now, // ברירת המחדל היא תאריך היצירה
  },
});

// יצירת מודל על בסיס הסכמה
const Post = mongoose.model("Post", postSchema);

// ייצוא המודל
module.exports = Post;
