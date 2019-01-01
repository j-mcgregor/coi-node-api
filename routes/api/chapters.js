const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const passport = require("passport");

// Models
const Chapter = require("../../models/Chapter");

// @route    GET api/chapters/test
// @desc     Tests Chapters Route
// @access   Public

router.get("/test", (req, res) => res.json({ msg: "Chapters works" }));

// @route    GET api/chapters
// @desc     Get all Chapters
// @access   Public

router.get("/", (req, res) => {
  Chapter.find()
    .then(chapters => {
      return res.json(chapters);
    })
    .catch(err =>
      res.status(404).json({ nochaptersfound: "No Chapters found" })
    );
});

// @route    GET api/chapters/:id
// @desc     Get single chapter
// @access   Public

router.get("/:id", (req, res) => {
  Chapter.findById(req.params.id)
    .then(chapter => res.json(chapter))
    .catch(err =>
      res.status(404).json({ nochapterfound: "No Chapter found with that ID" })
    );
});

// @route    POST api/chapters
// @desc     Create Chapters
// @access   Private

router.post(
  "/",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChapterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newChapter = new Chapter({
      country: req.body.country._id,
      city: req.body.city,
      leads: req.body.leads,
      twitterURL: req.body.twitterURL,
      bannerPic: req.body.bannerPic
    });

    console.log(newChapter);

    newChapter.save().then(chapter => res.json(chapter));
  }
);

// @route    DELETE api/chapters/:id
// @desc     Delete Chapters
// @access   Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Chapter.findById(req.params.id)
        .then(chapter => {
          // Check for chapter owner
          if (chapter.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ unauthorised: "User not Authorized" });
          }

          // Delete
          chapter.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ chapternotfound: "No Chapter Found" })
        );
    });
  }
);

module.exports = router;
