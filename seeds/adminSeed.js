const faker = require('faker');
const bcrypt = require('bcryptjs');
const uuidv1 = require('uuid/v1');
// Bring in User model
const User = require('../models/User');
const Chapter = require('../models/Chapter');

// Bring in Mongoose and connect to DB
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const env = require('../config/keys');
mongoose.connect(
  env.db,
  {
    useNewUrlParser: true
  }
);
// Drop the collection to avoid duplicates
User.collection.drop();

function getChapters() {
  return Chapter.find({ city: 'London' }).exec();
}

const profileDimensions = [
  '650/480',
  '640/480',
  '630/480',
  '620/480',
  '610/480',
  '600/480',
  '590/450',
  '580/450',
  '570/450',
  '560/450',
  '550/450'
];
const bannerDimensions = [
  '1000/1000',
  '1000/950',
  '1000/900',
  '1000/850',
  '1000/800',
  '1000/750',
  '1000/700',
  '900/900',
  '900/850',
  '900/800',
  '900/750',
  '900/700'
];
const topic = ['animals', 'arch', 'nature', 'people', 'tech'];

// ========= INIT =========
async function init() {
  const chapter = await getChapters();
  console.log(chapter);

  const randProfilePic = Math.floor(Math.random() * profileDimensions.length);
  const randBannerPic = Math.floor(Math.random() * bannerDimensions.length);

  const user = new User({
    username: 'jmcgregor',
    firstName: 'Jack',
    lastName: 'McGregor',
    organisation: 'Cardano',
    profilePic: `https://placeimg.com/${
      profileDimensions[randProfilePic]
    }/people`,
    bannerPic: `https://placeimg.com/${bannerDimensions[randBannerPic]}/arch`,
    bio: faker.lorem.paragraphs(),
    twitterUrl: faker.lorem.word(),
    linkedinUrl: faker.lorem.word(),
    chapter: chapter[0]._id,
    tagline: faker.lorem.sentence(),
    email: 'jackjwmcgregor@gmail.com',
    password: 'password',
    admin: true,
    lead: true
  });
  console.log(user);

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user.save();
      chapter[0].members = chapter[0].members++;
      chapter[0].save().then(console.log('New Admin created'));
    });
  });
}

init();
