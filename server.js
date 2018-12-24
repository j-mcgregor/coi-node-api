const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const projects = require("./routes/api/projects");
const chapters = require("./routes/api/chapters");
const countries = require("./routes/api/countries");

const app = express();

app.use(cors());
app.options("*", cors());

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").db;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Passport MiddleWare
app.use(passport.initialize());

// Passport Config
require("./config/passport.js")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/api/projects", projects);
app.use("/api/chapters", chapters);
app.use("/api/countries", countries);

const port = process.env.port || 3001;

app.listen(port, () => console.log(`Server is running on ${port}`));
