const async = require("async");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validatePasswordChangeInput = require("../../validation/passwordChange");

const keys = require("../../config/keys");

// Load User Model
const User = require("../../models/User");
const Chapter = require("../../models/Chapter");
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
                  chapter.members = chapter.members++;
                  chapter.save();
                  // chapter.members.forEach(member => {
                  //   // email the chapter leads
                  //   if (member.lead) {
                  //     const transporter = nodemailer.createTransport({
                  //       service: "gmail",
                  //       auth: {
                  //         user: process.env.EMAIL_SRC,
                  //         pass: process.env.PASSWORD_SRC
                  //       }
                  //     });
                  //
                  //     const mailOptions = {
                  //       from: "team@circleofyi.com",
                  //       to: `${member.email}`,
                  //       subject: "A new member",
                  //       html: `<h1 style="color:rgb(221, 53, 69);">A new member, ${
                  //         user.firstName
                  //       } ${user.lastName}, has joined ${chapter.city}</h1>`
                  //     };
                  //
                  //     transporter.sendMail(mailOptions, function(error, info) {
                  //       if (error) {
                  //         console.log(error);
                  //       } else {
                  //         console.log("Email sent: " + info.response);
                  //       }
                  //     });
                  //   }
                  // });
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

// @route    POST api/users/forgot
// @desc     Reset a password
// @access   Private

router.post("/forgot", (req, res) => {
  async.waterfall(
    [
      done => {
        crypto.randomBytes(20, (err, buf) => {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      (token, done) => {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (!user) {
            res.json({
              noemailfound: "No account with that email address exists."
            });
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(err => {
            done(err, token, user);
          });
        });
      },
      (token, user, done) => {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_SRC,
            pass: process.env.PASSWORD_SRC
          }
        });

        let header;
        if (process.env.NODE_ENV === "production") {
          header = "coi-client.herokuapp.com";
        } else {
          header = "localhost:3000";
        }

        const mailOptions = {
          from: "team@circleofyi.com",
          to: `${user.email}`,
          subject: "Circle of Intraprenurs password reset",
          html: `<h1 style="color:rgb(221, 53, 69);">You are receiving this because you (or someone else) have requested the reset of the password for your account</h1><h4>Please click on the following link, or paste this into your browser to complete the process<a href="http://${header}/reset/${token}/">here</a></h4>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
      }
    ],
    err => {
      if (err) return next(err);
      res.json({ message: "Error" });
    }
  );
});

// @route    POST api/users/reset/:token
// @desc     Check token
// @access   Public

router.get("/reset/:token", (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
});

// @route    POST api/users/reset/:token
// @desc     Check token
// @access   Public

router.post("/reset/:token", (req, res) => {
  const { errors, isValid } = validatePasswordChangeInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  async.waterfall([
    done => {
      User.findOne(
        {
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { $gt: Date.now() }
        },
        (err, user) => {
          if (!user) {
            res.json({
              invalidtoken: "Password reset token is invalid or has expired."
            });
          }

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.save().then(user => {
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: process.env.EMAIL_SRC,
                    pass: process.env.PASSWORD_SRC
                  }
                });

                var mailOptions = {
                  to: user.email,
                  from: "team@circleofyi.com",
                  subject: "Your password has been changed",
                  text:
                    "Hello,\n\n" +
                    "This is a confirmation that the password for your account " +
                    user.email +
                    " has just been changed.\n"
                };

                transporter.sendMail(mailOptions, error => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(`Email sent: ${info.response}`);
                  }
                });
                res.json(user);
              });
            });
          });
        }
      );
    }
  ]);
});

// @route    POST api/users/feedback
// @desc     Send feedback
// @access   Public

router.post("/feedback", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.gmail.com",
    port: 465,
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.EMAIL_SRC,
      pass: process.env.PASSWORD_SRC
    }
  });

  const mailOptions = {
    from: "circle.site.test.123@gmail.com",
    to: req.body.email,
    subject: "Feedbck",
    html: `<h1 style="color:rgb(221, 53, 69);">Thanks for your feedback, ${
      req.body.fullName
    }</h1><h3>You provided the following piece of feedback to the Circle of Intrapreneurs:</h3><p>${
      req.body.body
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
  // passport.authenticate("jwt", { session: false }),
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

// @route    PUT api/users/:id
// @desc     Update the selected user
// @access   Private

router.put(
  `/:id`,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    User.findByIdAndUpdate(req.user.id, req.body)
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
        // Chapter.findById(user.chapter)
        //   .then(chapter => {
        //     chapter.members.forEach((member, index) => {
        //       console.log(member);
        //       if (member._id === user._id) {
        //         chapter.members[index] = user;
        //       }
        //     });
        //     chapter.save();
        //   })
        //   .catch(err => console.log(err));
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
        // Chapter.findById(user.chapter)
        //   .then(chapter => {
        //     // console.log(chapter.members);
        //     for (var i = 0; i < chapter.members.length; i++) {
        //       let chapterID = chapter.members[i]._id.toString();
        //       let userID = user._id.toString();
        //
        //       if (chapterID == userID) {
        //         console.log("match");
        //         chapter.members[i] = user;
        //         chapter.save();
        //       }
        //     }
        //   })
        //   .catch(err => console.log(err));
        user.save().then(user => res.status(404).json(user));
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

module.exports = router;
