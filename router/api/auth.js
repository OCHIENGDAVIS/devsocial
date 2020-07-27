const express = require('express');
const authRouter = express.Router();
authRouter.get('/api/login', (req, res) => {
  res.send('login route');
});
module.exports = authRouter;
