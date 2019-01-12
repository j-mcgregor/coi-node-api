const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ChapterSchema = new Schema({
  country: {
    type: String,
    required: true
  },
  countryCode: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  lat: {
    type: Number
  },
  lng: {
    type: Number
  },
  leads: [
    {
      type: String
    }
  ],
  members: {
    type: Number,
    default: 0
  },
  posts: {
    type: Number,
    default: 0
  },
  projects: {
    type: Number,
    default: 0
  },
  twitterUrl: {
    type: String,
    required: true
  },
  facebookUrl: {
    type: String
  },
  linkedinUrl: {
    type: String
  },
  bannerPic: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Chapter = mongoose.model('chapters', ChapterSchema);
