const bunyan = require('bunyan');

module.exports = bunyan.createLogger({
  name: 'test',
  streams: [
    {
      // log INFO and above to stdout
      level: 'info',
      stream: process.stdout
    }
  ]
});
