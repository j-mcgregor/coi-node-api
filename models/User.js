const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const Project = require("./Project");
const Post = require("./Post");

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  organisation: {
    type: String,
    required: true
  },
  linkedinUrl: {
    type: String
  },
  twitterUrl: {
    type: String
  },
  chapter: {
    type: Schema.Types.ObjectId,
    ref: "chapters"
  },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: Project
    }
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: Post
    }
  ],
  profilePic: {
    type: String
  },
  bannerPic: {
    type: String
  },
  bio: {
    type: String
  },
  tagline: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  lead: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

module.exports = User = mongoose.model("users", UserSchema);
