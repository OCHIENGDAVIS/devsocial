const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

const authRouter = express.Router();

authRouter.post('/api/login', async (req, res) => {
  const { password, email } = req.body;
  if (validator.isEmpty(password) || validator.isEmpty(email)) {
    return res.status(400).send({ message: 'bad request' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).send({ message: 'invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get('JWT_SECRET'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.status(200).send({ token });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send();
  }
});
module.exports = authRouter;
