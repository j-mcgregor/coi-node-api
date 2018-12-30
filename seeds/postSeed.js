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
    const bodyText = `{"blocks":[{"key":"6re5n","text":"Ullamco laboris nisi ut aliquip","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"1v24s","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":183,"length":23,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"22baj","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"497ds","text":"eos qui ratione voluptatem","type":"header-four","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"1km4c","text":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":170,"length":17,"style":"BOLD"},{"offset":336,"length":18,"style":"UNDERLINE"}],"entityRanges":[],"data":{}},{"key":"80p3c","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ee6aa","text":"\\"At vero eos et accusamus et iusto odio \\"","type":"blockquote","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bseou","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"erqa2","text":"dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":255,"length":17,"style":"BOLD"},{"offset":472,"length":11,"style":"UNDERLINE"}],"entityRanges":[],"data":{}},{"key":"1n201","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2nggh","text":"officiis debitis aut rerum","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"a6ij9","text":"impedit quo ","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"46jph","text":"maxime placeatTe","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"b7ole","text":"mporibus autem","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;
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
