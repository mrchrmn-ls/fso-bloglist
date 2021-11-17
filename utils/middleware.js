const log = require("./log");

function requestLogger(req, _, next) {
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

function errorHandler(err, _, res, next) {
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

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
};