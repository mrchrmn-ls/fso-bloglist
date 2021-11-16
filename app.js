const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const config = require("./utils/config");
const bloglistRouter = require("./controllers/bloglist");
const middleware = require("./utils/middleware");
const log = require("./utils/log");

mongoose.connect(config.MONGODB_URL)
  .then(() => {
    log.info("connected to MongoDB");
  })
  .catch((error) => {
    log.error("error connecting to MongoDB:", error.message);
  });


app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/blogs", bloglistRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;