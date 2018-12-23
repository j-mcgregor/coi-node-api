const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const passport = require("passport");

// Models
const Country = require("../../models/Country");

// @route    GET api/countrys/test
// @desc     Tests Countrys Route
// @access   Public

router.get("/test", (req, res) => res.json({ msg: "Countrys works" }));

// @route    GET api/countrys
// @desc     Get all Countrys
// @access   Public

router.get("/", (req, res) => {
  Country.find()
    .then(countries => res.json(countries))
    .catch(err =>
      res.status(404).json({ nocountrysfound: "No Countrys found" })
    );
});

// @route    GET api/countrys/:id
// @desc     Get single country
// @access   Public

router.get("/:id", (req, res) => {
  Country.findById(req.params.id)
    .then(country => res.json(country))
    .catch(err =>
      res.status(404).json({ nocountryfound: "No Country found with that ID" })
    );
});

// @route    POST api/countrys
// @desc     Create Countrys
// @access   Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newCountry = new Country({
      name: req.body.leads
    });

    newCountry.save().then(country => res.json(country));
  }
);

// @route    DELETE api/countrys/:id
// @desc     Delete Countrys
// @access   Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Country.findById(req.params.id)
        .then(country => {
          // Check for country owner
          if (country.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ unauthorised: "User not Authorized" });
          }

          // Delete
          country.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ countrynotfound: "No Country Found" })
        );
    });
  }
);

module.exports = router;
