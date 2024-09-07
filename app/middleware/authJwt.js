const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  let token = authHeader.split(' ')[1]; 

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

    if (user.role === "admin") {
      return next();
    }
    return res.status(403).send({
      message: "Hanya admin yang bisa mengakses!",
    });
  } catch (error) {
    return res.status(500).send({
      message: `Error -> ${error}`,
    });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};

module.exports = authJwt;
