const faker = require("faker");
// Bring in Mongoose and connect to DB
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const env = require("../config/keys");
mongoose.connect(
  env.db,
  {
    useNewUrlParser: true
  }
);
// Bring in User model
const Project = require("../models/Project");
const User = require("../models/User");

// Drop the collection to avoid duplicates
Project.collection.drop();

function getUsers() {
  return User.find().exec();
}

// ========= CREATE PROJECTS =========
async function createProjects() {
  const users = await getUsers();

  await users.forEach((user, index) => {
    const rand = Math.floor(Math.random() * 2);
    // console.log(user._id, index);
    for (var i = 0; i < rand; i++) {
      const project = new Project({
        title: faker.lorem.sentence(),
        intro: faker.lorem.paragraphs(),
        impact: faker.lorem.paragraphs(),
        businesscase: faker.lorem.paragraphs(),
        user: user
      });
      project.save();
    }
  });
}

createProjects();
