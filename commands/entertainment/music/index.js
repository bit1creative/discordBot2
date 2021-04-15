const { execute, skip, stop } = require("./player");

class Player {
  static play(message) {
    execute(message);
  }
  static skip(message) {
    skip(message);
  }
  static stop(message) {
    stop(message);
  }
}

module.exports = { Player };
