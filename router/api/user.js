const express = require('express');
const router = express.Router();
const validator = require('validator');
const passwordValidator = require('password-validator');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const USer = require('../../models/User');
const User = require('../../models/User');
const config = require('config');

// password validation rules
var schema = new passwordValidator();
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .not()
  .spaces(); // Should not have spaces;

//   CREATING A NEW USER
router.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;
  if (
    validator.isEmpty(name) ||
    validator.isEmpty(email) ||
    validator.isEmpty(password)
  ) {
    return res.status(400).send({ message: 'bad request' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: 'bad request' });
  }
  if (!schema.validate(password)) {
    return res.status(400).send({ message: 'bad request' });
  }
  try {
    let user = await User.findOne({ email, name });
    if (user) {
      return res.status(400).send({ message: 'bad request' });
    }
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });
    user = new User({ name, email, avatar, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      config.get('JWT_SECRET'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.status(201).send({ token });
      }
    );
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
