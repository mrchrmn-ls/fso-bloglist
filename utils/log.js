function info(...params) {
  console.log(...params);
}

function error(...params) {
  console.log(...params);
}

module.exports = {
  info, error
};