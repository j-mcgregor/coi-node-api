const faker = require("faker");
const bcrypt = require("bcryptjs");
const uuidv1 = require("uuid/v1");
// Bring in User model
const User = require("../models/User");
const Chapter = require("../models/Chapter");

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
// Drop the collection to avoid duplicates
User.collection.drop();

function getChapters() {
  return Chapter.find().exec();
}

const profileDimensions = [
  "650/480",
  "640/480",
  "630/480",
  "620/480",
  "610/480",
  "600/480",
  "590/450",
  "580/450",
  "570/450",
  "560/450",
  "550/450"
];
const bannerDimensions = [
  "1000/1000",
  "1000/950",
  "1000/900",
  "1000/850",
  "1000/800",
  "1000/750",
  "1000/700",
  "900/900",
  "900/850",
  "900/800",
  "900/750",
  "900/700"
];
const topic = ["animals", "arch", "nature", "people", "tech"];

// ========= INIT =========
async function init() {
  const chapters = await getChapters();

  await chapters.forEach((chapter, index) => {
    const rand = Math.floor(Math.random() * 20) + 5;
    const randProfilePic = Math.floor(Math.random() * profileDimensions.length);
    const randBannerPic = Math.floor(Math.random() * bannerDimensions.length);
    for (var i = 0; i < rand; i++) {
      let email;
      let admin = false;
      let lead = false;
      if (i === 0) {
        email = `admin@test${index}.com`;
        admin = true;
      } else if (i === 1) {
        email = `lead@test${index}.com`;
        lead = true;
      } else if (i === 2) {
        email = `jackjwmcgregor@gmail.com`;
        admin = true;
        lead = true;
      } else {
        email = `test${i}@test${index}.com`;
      }

      const user = new User({
        username: faker.lorem.word(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        organisation: faker.company.companyName(),
        profilePic: `https://placeimg.com/${
          profileDimensions[randProfilePic]
        }/people`,
        bannerPic: `https://placeimg.com/${
          bannerDimensions[randBannerPic]
        }/arch`,
        bio: faker.lorem.paragraphs(),
        twitterUrl: faker.lorem.word(),
        linkedinUrl: faker.lorem.word(),
        chapter: chapter._id,
        tagline: faker.lorem.sentence(),
        email: email,
        password: "password",
        admin: admin,
        lead: lead
      });
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.save();
          chapter.members = chapter.members++;
          chapter.save();
        });
      });
    }
  });
}

init();
