const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const keys = require("../../config/keys");

// Load User Model
const User = require("../../models/User");
const Project = require("../../models/Project");

// @route    GET api/users/test
// @desc     Tests Users Route
// @access   Public

router.get("/test", (req, res) => res.json({ msg: "Users works" }));

// @route    POST api/users/register
// @desc     Register a User
// @access   Public

router.post("/register", (req, res) => {
  // Bring in the function from validation/register
  // The errors starts and ends as an empty object
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // req.body requires bodyParser in server.js
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        organisation: req.body.organisation,
        profilePic: req.body.profilePic,
        bannerPic: req.body.bannerPic,
        chapter: req.body.chapter,
        linkedinUrl: req.body.linkedinUrl,
        twitterUrl: req.body.twitterUrl,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              Chapter.findById(user.chapter)
                .then(chapter => {
                  chapter.members.forEach(member => {
                    if (member.lead) {
                      const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                          user: process.env.EMAIL_SRC,
                          pass: process.env.PASSWORD_SRC
                        }
                      });

                      const mailOptions = {
                        from: "team@circleofyi.com",
                        to: `${member.email}`,
                        subject: "A new member",
                        html: `<h1 style="color:rgb(221, 53, 69);">A new member, ${
                          user.firstName
                        } ${user.lastName}, has joined ${chapter.city}</h1>`
                      };

                      transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log("Email sent: " + info.response);
                        }
                      });
                    }
                  });
                })
                .catch(err => console.log(err));
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.EMAIL_SRC,
                  pass: process.env.PASSWORD_SRC
                }
              });

              const mailOptions = {
                from: "team@circleofyi.com",
                to: `${user.email}`,
                subject: "Welcome to the Circle of Intraprenurs",
                html: `<h1 style="color:rgb(221, 53, 69);">Welcome to the Circle of Intrapreneurs, ${
                  user.firstName
                }</h1><a href="http://www.google.com">Google</a>`
              };

              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
              res.json(user);
            })
            .catch(err => res.json(err));
        });
      });
    }
  });
});

// @route    POST api/users/feedback
// @desc     Send feedback
// @access   Public

router.post("/feedback", (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "Yahoo",
    auth: {
      user: process.env.EMAIL_SRC,
      pass: process.env.PASSWORD_SRC
    }
  });

  const mailOptions = {
    from: "circletest123@@yahoo.com",
    to: req.body.feedback.email,
    subject: "Feedbck",
    html: `<h1 style="color:rgb(221, 53, 69);">Thanks for your feedback, ${
      req.body.feedback.fullName
    }</h1><h3>You provided the following piece of feedback to the Circle of Intrapreneurs:</h3><p>${
      req.body.feedback.body
    }</p>`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});
// @route    GET api/users/login
// @desc     Login a User / Return the JWT
// @access   Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find User by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(400).json(errors);
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // res.json({message: 'Success'});

        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          admin: user.admin,
          lead: user.lead
        }; // Create JWT payload

        // Assign the token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route    DELETE api/users/:id
// @desc     Remove a User
// @access   Public (for now)

router.delete(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Find User by email
    User.deleteOne({ _id: req.params.id })
      .then(res.send("User deleted"))
      .catch(err => console.log(err));
  }
);

// @route    GET api/users/current
// @desc     Return the current user
// @access   Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

// @route    GET api/users/:id
// @desc     Return the selected user
// @access   Private

router.get(
  `/:id`,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    User.findById(req.params.id)
      .then(user => res.status(200).json(user))
      .catch(err => {
        errors.usernotfound = "User Not Found";
        return res.status(400).json(errors);
      });
  }
);

// @route    GET api/users/:id/projects
// @desc     Get a users projects
// @access   Private

router.get("/:id/projects", (req, res) => {
  Project.find({ user: req.params.id })
    .populate("user", ["_id", "firstName", "lastName"])
    .then(projects => res.json(projects))
    .catch(err =>
      res
        .status(404)
        .json({ noprojectsfound: "No Project found with that User" })
    );
});

// @route    GET api/users
// @desc     Return all users
// @access   Public

router.get("/", (req, res) => {
  User.find()
    .populate("chapter", ["_id", "city"])
    .populate("projects", ["_id", "title"])
    .exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => console.log(err));
});

// @route    GET api/users/current
// @desc     Get current users profile
// @access   Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    // comes from the schema
    User.findOne({ user: req.user.id })
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @route    PUT api/users/:id/admin
// @desc     Set Admin
// @access   Private

router.get(
  "/:id/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.params.id })
      .then(user => {
        user.admin ? (user.admin = false) : (user.admin = true);
        // user.admin = !user.admin;
        user.save().then(user => res.status(404).json(user));
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @route    PUT api/users/:id/lead
// @desc     Set Lead
// @access   Private

router.get(
  "/:id/lead",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.params.id })
      .then(user => {
        user.lead ? (user.lead = false) : (user.lead = true);
        user.save().then(user => res.status(404).json(user));
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

module.exports = router;
