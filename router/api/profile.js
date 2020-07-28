const express = require('express');
const profileRouter = express.Router();
const Profile = require('../../models/profile');
const auth = require('../../middleware/auth');
const router = require('./user');
const { check, validationResult } = require('express-validator');

profileRouter.get('/api/profile/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('User', ['name', 'avatar']);
    if (!profile) {
      return res.status(404).send({ message: 'not found' });
    }
    res.status(200).send(profile);
  } catch (err) {
    return res.status(500).send(err);
  }
});

profileRouter.post(
  '/api/profile',
  [
    auth,
    [
      check('status', 'status is required').not().isEmpty(),
      check('skills', 'skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
    // Build  a profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    //  Build social array
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update profile
        await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.status(200).send(profile);
      }
      // create
      profile = new Profile(profileFields);
      await profile.save();
      return res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
    return res.status(200).send();
  }
);

module.exports = profileRouter;
