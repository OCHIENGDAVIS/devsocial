const express = require('express');
const postRouter = express.Router();
postRouter.get('/api/post', (req, res) => {
  res.send('post route');
});
module.exports = postRouter;
