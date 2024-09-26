const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  location: {
    address: String,   // Address as a string
    city: String,      // City as a string
    coordinates: {     // Coordinates (latitude and longitude)
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
