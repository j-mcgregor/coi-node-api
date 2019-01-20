const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

// emails
const nodemailer = require('nodemailer');
const projectProposal = require('./emails/projectProposal');

// Models
const Project = require('../../models/Project');
const User = require('../../models/User');
const Chapter = require('../../models/Chapter');

// validation
const validateProjectInput = require('../../validation/project');

// @route    GET api/projectss/test
// @desc     Tests Projects Route
// @access   Public

router.get('/test', (req, res) => res.json({ msg: 'Projects works' }));

// @route    GET api/projectss
// @desc     Get all Projects
// @access   Public

router.get('/', (req, res) => {
  Project.find()
    .populate('user')
    .then(projectss => res.json(projectss))
    .catch(err =>
      res.status(404).json({ noprojectssfound: 'No Projects found' })
    );
});

// @route    GET api/projectss/:id
// @desc     Get single project
// @access   Public

router.get('/:id', (req, res) => {
  Project.findById(req.params.id)
    .populate('user', ['_id', 'firstName', 'lastName'])
    .then(project => res.json(project))
    .catch(err =>
      res.status(404).json({ noprojectsfound: 'No Project found with that ID' })
    );
});

// @route    POST api/projectss
// @desc     Create Projects
// @access   Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newProject = new Project({
      user: req.user.id,
      title: req.body.title,
      intro: req.body.intro,
      impact: req.body.impact,
      businesscase: req.body.businesscase
    });

    newProject
      .save()
      .then(project => {
        // ====== EMAIL PROJECT AUTHOR START ======
        User.findById(req.user.id)
          .then(user => {
            // ====== EMAIL AUTHORS CHAPTER LEADS START ======
            User.find({ chapter: user.chapter })
              .then(users => {
                const leads = users.filter(user => user.lead === true);
                leads.forEach(lead => {
                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: process.env.EMAIL_SRC,
                      pass: process.env.PASSWORD_SRC
                    }
                  });

                  const mailOptions = {
                    from: 'team@circleofyi.com',
                    to: `${lead.email}`,
                    subject: 'A member just posted',
                    html:
                      'A member of your chapter has just submitted a proposal'
                  };

                  transporter.sendMail(mailOptions, function(error, info) {
                    error
                      ? console.log(error)
                      : console.log('Email sent: ' + info.response);
                  });
                });
              })
              .catch(err => console.log(err));
            // ====== EMAIL AUTHORS CHAPTER LEADS END ======
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.EMAIL_SRC,
                pass: process.env.PASSWORD_SRC
              }
            });

            const mailOptions = {
              from: 'team@circleofyi.com',
              to: `${user.email}`,
              subject: 'You\'ve started your journey!',
              html: projectProposal
            };

            transporter.sendMail(mailOptions, function(error, info) {
              error
                ? console.log(error)
                : console.log('Email sent: ' + info.response);
            });
          })
          .catch(err => console.log(err));
        // ====== EMAIL PROJECT AUTHOR END ======
        res.json(project);
      })
      .catch(err => res.json(err));
  }
);

// @route    UPDATE api/projects/:id
// @desc     Update Project
// @access   Private

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Project.findByIdAndUpdate(req.params.id, req.body)
      .then(project => res.status(200).json(project))
      .catch(err => {
        errors.projectnotfound = 'Project Not Found';
        return res.status(400).json(errors);
      });
  }
);

// @route    DELETE api/projectss/:id
// @desc     Delete Projects
// @access   Private

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Project.findById(req.params.id)
      .then(project => {
        // Check for project owner
        // if (!req.user.admin) {
        //   return res.status(401).json({
        //     unauthorised: 'User not Authorized',
        //     project: project,
        //     user: req.user
        //   });
        // }

        // Delete
        project.remove();
      })
      .catch(err =>
        res.status(404).json({ projectsnotfound: 'No Project Found' })
      );
  }
);

module.exports = router;
