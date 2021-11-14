const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  userType: {
    type: String,
    required: true,
    default: "admin",
  },
});
const User = mongoose.model("users", UserSchema);
module.exports = User;
