const jwt = require("jsonwebtoken");

function generateToken(payload) {
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d'});
    return token;
  }

  module.exports = {generateToken};