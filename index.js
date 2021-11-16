const http = require("http");

const app = require("./app");
const config = require("./utils/config");
const log = require("./utils/log");

const server = http.createServer(app);

server.listen(config.PORT, () => {
  log.info(`Server listening on port ${config.PORT}`);
});