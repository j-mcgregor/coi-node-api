const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ChapterSchema = new Schema({
  country: {
    type: Schema.Types.ObjectId,
    ref: "countries"
  },
  city: {
    type: String,
    required: true
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
  twitterURL: {
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
