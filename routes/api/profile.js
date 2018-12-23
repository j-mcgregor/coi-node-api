const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile
const Profile = require('../../models/Profile');
// Load User
const User = require('../../models/User');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// @route    GET api/profile/test
// @desc     Tests Profile Route
// @access   Public

router.get('/test', (req,res) => res.json({msg: 'Profile works'}));

// @route    GET api/profile/
// @desc     Get current users profile
// @access   Private

router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const errors = {};
  // comes from the schema
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// @route    GET api/profile/all
// @desc     Get all profiles
// @access   Public

router.get('/all', (req, res) => {
  const errors = {};
  Profile
    .find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({
      profile: 'There are no profiles'
    }));
});

// @route    GET api/profile/handle/:handle
// @desc     Get profile by handle
// @access   Public

router.get('/handle/:handle', (req,res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', [ 'name', 'avatar' ])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public

router.get('/user/:user_id', (req,res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', [ 'name', 'avatar' ])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for this user'}));
});

// @route    POST api/profile/
// @desc     Create or update users profile
// @access   Private

router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  // Destructuring
  const { errors, isValid } = validateProfileInput(req.body);

  // Check Validation
  if (!isValid) {
    // return any errors with 400 status
    return res.status(400).json(errors);
  }

  // Get Fields
  const ProfileFields = {};
  ProfileFields.user = req.user.id;
  // Set the handle
  if(req.body.handle) ProfileFields.handle = req.body.handle;
  // Set the company
  if(req.body.company) ProfileFields.company = req.body.company;
  // Set the website
  if(req.body.website) ProfileFields.website = req.body.website;
  // Set the location
  if(req.body.location) ProfileFields.location = req.body.location;
  // Set the status
  if(req.body.status) ProfileFields.status = req.body.status;
  // Set the githubusername
  if(req.body.githubusername) ProfileFields.githubusername = req.body.githubusername;
  // Set the bio
  if(req.body.bio) ProfileFields.bio = req.body.bio;

  // Set the Skills - split into array
  if (typeof req.body !== undefined) {
    ProfileFields.skills = req.body.skills.split(',');
  }

  // Set the social
  ProfileFields.social = {};
  if(req.body.youtube) ProfileFields.social.youtube = req.body.youtube;
  if(req.body.twitter) ProfileFields.social.twitter = req.body.twitter;
  if(req.body.instagram) ProfileFields.social.instagram = req.body.instagram;
  if(req.body.linkedin) ProfileFields.social.linkedin = req.body.linkedin;
  if(req.body.facebook) ProfileFields.social.facebook = req.body.facebook;

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: ProfileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check for handle
        Profile.findOne({ handle: ProfileFields.handle })
          .then(profile => {
            if(profile) {
              errors.handle = 'That handle already exists';
              return res.status(400).json(errors);
            }

            new Profile(ProfileFields)
              .save()
              .then(profile => {
                res.json(profile);
              });
          });
      }
    });
});

// @route    POST api/profile/experience
// @desc     Add Experience to Profile
// @access   Private

router.post('/experience', passport.authenticate('jwt', { session: false }), (req,res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id})
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to experience array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
});

// @route    POST api/profile/education
// @desc     Add Education to Profile
// @access   Private

router.post('/education', passport.authenticate('jwt', { session: false }), (req,res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id})
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to experience array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
});

// @route    DELETE api/profile/experience/:exp_id
// @desc     Remove Experience from Profile
// @access   Private

router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req,res) => {


  Profile.findOne({ user: req.user.id})
    .then(profile => {
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      // Splice out of array
      profile.experience.splice(removeIndex, 1);

      // Save and Return
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route    DELETE api/profile/experience/:exp_id
// @desc     Remove Experience from Profile
// @access   Private

router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req,res) => {


  Profile.findOne({ user: req.user.id})
    .then(profile => {
      // Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      // Splice out of array
      profile.education.splice(removeIndex, 1);

      // Save and Return
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route    DELETE api/profile
// @desc     Remove User and Profile
// @access   Private

router.delete('/', passport.authenticate('jwt', { session: false }), (req,res) => {


  Profile.findOneAndRemove({ user: req.user.id })
    .then( () => {
      User.findOneAndRemove({ _id: req.user.id })
        .then(res.json({ success: true }));
    });
});


module.exports = router;
