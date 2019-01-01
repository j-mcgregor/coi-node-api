const mongoose = require("mongoose");
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
    type: String
  },
  lng: {
    type: String
  },
  leads: [
    {
      type: String
    }
  ],
  members: [
    {
      type: Object
    }
  ],
  twitterUrl: {
    type: String,
    required: true
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

module.exports = Chapter = mongoose.model("chapters", ChapterSchema);
