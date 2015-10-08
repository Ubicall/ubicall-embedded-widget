var winston = require("winston");
var logger = new (winston.Logger)({
  levels: {
    trace: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
  },
  colors: {
    trace: "magenta",
    input: "grey",
    verbose: "cyan",
    prompt: "grey",
    debug: "blue",
    info: "green",
    data: "grey",
    help: "cyan",
    warn: "yellow",
    error: "red"
  }
});


logger.add(winston.transports.Console, {
  level: process.env.node_env !== "production" ? "verbose" : "info",
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: true
});

logger.add(winston.transports.DailyRotateFile, {
  level: process.env.node_env !== "production" ? "verbose" : "info",
  prettyPrint: false,
  silent: false,
  colorize: false,
  timestamp: true,
  filename: "./.log/widget.log",
  json: false
});

module.exports = logger;
