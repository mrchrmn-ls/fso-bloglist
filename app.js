const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("express-async-errors");
const app = express();

const config = require("./utils/config");
const middleware = require("./utils/middleware");
const log = require("./utils/log");

const bloglistRouter = require("./controllers/bloglist");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

mongoose.connect(config.MONGODB_URL)
  .then(() => {
    log.info("connected to MongoDB");
  })
  .catch((error) => {
    log.error("error connecting to MongoDB:", error.message);
  });


app.use(cors());
app.use(express.json());

app.use(middleware.logRequests);
app.use(middleware.extractToken);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/blogs", bloglistRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.handleErrors);

module.exports = app;