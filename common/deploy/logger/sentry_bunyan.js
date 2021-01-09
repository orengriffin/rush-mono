const Sentry = require('@sentry/node');

const bunyanToSentryLevelMap = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warning',
  50: 'error',
  60: 'fatal'
};

const sentryBunyanBreadcrumbs = {
  level: 'debug',
  type: 'raw', // Mandatory type for sentry
  stream: {
    write(record) {
      Sentry.addBreadcrumb({
        message: record.msg,
        level: bunyanToSentryLevelMap[record.level]
      });
    }
  }
};

const deserializeError = record => {
  const error = new Error(record.msg);
  error.name = record.msg;
  error.stack = record.err;
  return error;
};

const sentryBunyanException = {
  level: 'error',
  type: 'raw', // Mandatory type for sentry
  stream: {
    write(record) {
      Sentry.withScope(scope => {
        scope.setLevel(bunyanToSentryLevelMap[record.level]);
        scope.setUser({ id: record.user });
        scope.setTag('customer', record.customer);
        scope.setTag('requestId', record.requestId);
        scope.setTag('url', record.requestedUrl);
        scope.setTag('method', record.method);
        scope.setExtra('agent', record.userAgent);
        scope.setExtra('hostname', record.hostname);
        scope.setExtra('ip', record.ip);
        if (record.err) Sentry.captureException(deserializeError(record));
        else Sentry.captureMessage(record.msg);
      });
    }
  }
};

module.exports = {
  sentryBunyanBreadcrumbs,
  sentryBunyanException
};
