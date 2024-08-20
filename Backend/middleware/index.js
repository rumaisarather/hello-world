const jwt = require("jsonwebtoken");

async function userValidate(req, res, next) {
  let token = req.headers["authorization"];
  token = token?.split("Bearer ")[1];

  if (!token) {
    return res.status(403).json({ auth: false, message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });
    }

    if (decoded.role && decoded.role.toLowerCase() === "user") {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ auth: false, message: "Not authorized" });
    }
  });
}

module.exports = { userValidate };
