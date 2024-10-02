const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path"); // ייבוא מודול path

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  phoneNumber: {
    type: String,
    required: true,
  },
  mainInstrument: {
    type: String,
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
  profilePicture: {
    type: String,
    default: path.join(__dirname, 'assets', 'img', 'Default_pfp.svg.png'), // עדכון לנתיב הנכון
  },
});

const User = mongoose.model("NewUser", UserSchema);

module.exports = User;
