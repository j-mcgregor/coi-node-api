const faker = require("faker");
const chaptersList = require("./test"); //should change to chapters
const countryList = require("./countries");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const uuidv1 = require("uuid/v1");
// Bring in User model
const User = require("../models/User");
const Country = require("../models/Country");
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
Country.collection.drop();
Chapter.collection.drop();

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

// ========= CREATE COUNTRIES =========
function createCountries(countryArray) {
  for (var i = 0; i < countryArray.length; i++) {
    const country = Country.create({
      name: countryArray[i].name,
      code: countryArray[i].code
    });
  }
}

function getCountries() {
  return Country.find();
}

// ========= CREATE CHAPTERS =========
function createChapters(countryArray) {
  let chapters = [];
  chaptersList.forEach(chapter => {
    const country = Math.floor(Math.random() * countryArray.length);
    const randBannerPic = Math.floor(Math.random() * bannerDimensions.length);
    const newChapter = Chapter.create({
      bannerPic: `https://placeimg.com/${bannerDimensions[randBannerPic]}/arch`,
      lat: chapter.lat,
      lng: chapter.lng,
      city: chapter.city,
      country: chapter.country,
      countryCode: chapter.countryCode,
      twitterUrl: "http://twitter.com/circleofyi",
      facebookUrl: "http://facebook.com/circleofyi",
      linkedinUrl: "http://linkedin.com/circleofyi"
    });
    chapters.push(newChapter);
  });
  return chapters;
}

function getChapters() {
  return Chapter.find().exec();
}

// ========= INIT =========
async function init(countryList) {
  await createCountries(countryList);
  const countries = await getCountries();
  await createChapters(countries);
  const chapters = await getChapters();

  Country.find()
    .then(countries => console.log(`${countries.length} countries `))
    .catch(err => console.log(err));

  Chapter.find()
    .then(chapters => {
      console.log(`${chapters.length} chapters `);
    })
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());
}

init(countryList);
