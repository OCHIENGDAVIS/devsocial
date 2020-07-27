const express = require('express');
const profileRouter = express.Router();

profileRouter.get('/api/profile', (req, res) => {
  res.send('profile route');
});

module.exports = profileRouter;
