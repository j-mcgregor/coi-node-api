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
    const bodyText = `<h1><span style=\"color: rgb(0, 0, 0);\">Lorem ipsum dolor </span></h1><p><br></p><p><span style=\"color: rgb(0, 0, 0);\">Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</span></p><p><br></p><h2><span style=\"color: rgb(0, 0, 0);\">Sed ut perspiciatis unde </span></h2><p><br></p><p><span style=\"color: rgb(0, 0, 0);\">omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam </span><strong style=\"color: rgb(0, 0, 0);\">est, qui dolorem</strong><span style=\"color: rgb(0, 0, 0);\"> ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur</span></p>`;
    if (index % 3 === 0) {
      const rand = Math.floor(Math.random() * 3);
      const randBannerPic = Math.floor(Math.random() * bannerDimensions.length);
      for (var i = 0; i < rand; i++) {
        const post = new Post({
          title: faker.lorem.sentence(),
          body: bodyText,
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
