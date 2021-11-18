const jwt = require("jsonwebtoken");
const User = require("../models/user");
const log = require("./log");

function logRequests(req, _, next) {
  log.info("Method:", req.method);
  log.info("Path:", req.path);
  log.info("Bdy:", req.body);
  log.info("---");
  next();
}

function unknownEndpoint(_, res) {
  res.status(404).send({
    error: "Unknown endpoint"
  });
}

function handleErrors(err, _, res, next) {
  log.info(err.message);

  if (err.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
    return null;
  }

  if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
    return null;
  }

  if (err.name === "PasswordError") {
    res.status(400).json({ error: "password must have at least 3 characters" });
    return null;
  }

  next(err);
}

function extractToken(req, _, next) {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  }

  next();
}

async function getUser(req, res, next) {
  if (!req.token) {
    res.status(401).json({
      error: "token missing"
    });

    return null;
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken.id) {
    res.status(401).json({
      error: "token invalid"
    });

    return null;
  }

  req.user = await User.findById(decodedToken.id);

  next();
}

module.exports = {
  logRequests,
  unknownEndpoint,
  handleErrors,
  extractToken,
  getUser
};