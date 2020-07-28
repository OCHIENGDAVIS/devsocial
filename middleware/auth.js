const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send({ message: 'forbiden' });
  }
  try {
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).send({ message: 'invalid token' });
  }
};
module.exports = auth;
