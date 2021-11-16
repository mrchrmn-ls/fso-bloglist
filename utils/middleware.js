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
    return res.status(400).send({ error: "malformatted id" });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
};