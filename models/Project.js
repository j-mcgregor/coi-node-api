const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = {
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: true
  },
  impact: {
    type: String,
    required: true
  },
  businesscase: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
};

module.exports = Project = mongoose.model("project", ProjectSchema);
