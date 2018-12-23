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
const Post = require("../models/Post");
const User = require("../models/User");

// Drop the collection to avoid duplicates
Post.collection.drop();

function getUsers() {
  return User.find().exec();
}

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

// ========= CREATE PROJECTS =========
async function createPosts() {
  const users = await getUsers();

  await users.forEach((user, index) => {
    if (index % 3 === 0) {
      const rand = Math.floor(Math.random() * 3);
      const randBannerPic = Math.floor(Math.random() * bannerDimensions.length);
      for (var i = 0; i < rand; i++) {
        const post = new Post({
          title: faker.lorem.sentence(),
          body: faker.lorem.paragraphs(),
          tagline: faker.lorem.sentence(),
          images: [
            `https://placeimg.com/${
              bannerDimensions[randBannerPic]
            }/any/grayscale`
          ],
          user: user
        });
        console.log(`post created`);
        post.save();
      }
    }
  });
}

createPosts();
