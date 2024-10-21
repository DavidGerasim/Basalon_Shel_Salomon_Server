const mongoose = require("mongoose");
const schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
  createdBy: {
    type: schema.Types.ObjectId,
    required: true,
    ref: "NewUser",
  },
  city: {
    type: Object,
    required: false,
  },
  latitude: {
    type: Number,
    required: false,
  },
  longitude: {
    type: Number,
    required: false,
  },
  date: {
    type: Date,
    required: false,
  },
  beginningTime: {
    type: Date,
    required: false,
  },
  endTime: {
    type: Date,
    required: false,
  },
  musicians: {
    type: Number,
    required: false,
  },
  friends: {
    type: Number,
    required: false,
  },
  instruments: {
    type: String,
    required: false,
  },
  comment: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
