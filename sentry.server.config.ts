import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  enabled: Boolean(process.env.SENTRY_DSN),
  beforeSend(event) {
    if (event.user?.email) delete event.user.email
    return event
  },
})
