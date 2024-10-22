const mongoose = require("mongoose");
const schema = mongoose.Schema;

const gigSchema = new mongoose.Schema({
  host: {
    type: schema.Types.ObjectId,
    required: true,
    ref: "NewUser",
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  address: {
    description: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  musiciansAllowed: {
    type: Number,
    required: true,
  },
  friendsAllowed: {
    type: Number,
    required: true,
  },
  musiciansCount: {
    type: Number,
    required: false,
  },
  friendsCount: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Gig = mongoose.model("Gig", gigSchema);

module.exports = Gig;
