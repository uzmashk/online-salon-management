const authConfig = require('../config/auth.config');
const jwt = require('jsonwebtoken')
const status = require('http-status')

const verifyToken = (req, res, next) => {
  let bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    return res.status(status.FORBIDDEN).send({
      message: "No token provided!"
    });
  }

  const token = bearerHeader.split(' ')[1];

  jwt.verify(token, authConfig.secret, (err, decoded) => {

    if (err) {
      return res.status(status.UNAUTHORIZED).send({
        message: "Unauthorized user!"
      });
    }

    req.id = decoded.id,
    req.role = decoded.role

    next();
  });
}

module.exports = {
  verifyToken
};