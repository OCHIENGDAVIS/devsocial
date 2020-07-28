const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

const authRouter = express.Router();

authRouter.get('/api/login', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send();
  }
});
module.exports = authRouter;
