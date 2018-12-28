const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const passport = require("passport");
const cloudinary = require("cloudinary");
const axios = require("axios");
const multer = require("multer");
const fileUploadMiddleware = require("../../fileUploadMiddleware");

const storage = multer.memoryStorage();
const UPLOAD_PATH = "uploads";
const upload = multer({ dest: `${UPLOAD_PATH}/` });

// Models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Bring in Post Validation
const validatePostInput = require("../../validation/post");

// @route    GET api/posts/test
// @desc     Tests Posts Route
// @access   Public

router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

// @route    GET api/posts
// @desc     Get all Posts
// @access   Public

router.get("/", (req, res) => {
  Post.find()
    .populate("user")
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No Posts found" }));
});

// @route    GET api/posts/:id
// @desc     Get single post
// @access   Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("user")
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No Post found with that ID" })
    );
});

// @route    POST api/posts
// @desc     Create Posts
// @access   Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newPost = new Post({
      title: req.body.title,
      tagline: req.body.tagline,
      body: req.body.body,
      images: req.body.images,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route    POST api/posts/files
// @desc     Upload Posts Image
// @access   Private

router.post("/files", upload.single("file"), (req, res) => {
  cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_NAME}`,
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`
  });
  cloudinary.v2.uploader.upload(req.file.path, function(error, result) {
    if (error) {
      return res.json(error);
    } else if (result) {
      return res.json(result);
    }
  });
});

// @route    PUT api/posts/:id
// @desc     Create Posts
// @access   Private

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },

      (err, post) => {
        if (err) return res.status(500).send(err);
        return res.send(post);
      }
    );
  }
);

// @route    DELETE api/posts/:id
// @desc     Delete Posts
// @access   Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.params);
    Post.findById(req.params.id)
      .then(post => {
        // Delete
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ postnotfound: "No Post Found" }));
  }
);

// @route    POST api/posts/like/:id
// @desc     Like Posts
// @access   Private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          // Add user Id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route    POST api/posts/unlike/:id
// @desc     Unlike Posts
// @access   Private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }

          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route    POST api/posts/comment/:id
// @desc     Add a comment to posts
// @access   Private

router.post(
  "/comments/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(404).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // save
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ postnotfound: "No Comments Found" })
      );
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete a comment from posts
// @access   Private

router.delete(
  "/comments/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
