const bunyan = require('bunyan');
const { sentryBunyanBreadcrumbs, sentryBunyanException } = require('./sentry_bunyan');


module.exports = bunyan.createLogger({
  name: 'optibus',
  streams: [
    {
      // log INFO and above to stdout
      level: 'info',
      stream: process.stdout
    },
    sentryBunyanBreadcrumbs,
    sentryBunyanException
  ]
});
