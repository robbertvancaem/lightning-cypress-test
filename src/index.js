import { Launch, Profile } from '@lightningjs/sdk'
import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'

import App from './App.js'

export default function() {
  Sentry.init({
    dsn: 'https://f0fc5026e5da4874a053f145cd91ab1d@o1427079.ingest.sentry.io/6776347',
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    initialScope: scope => {
      Profile.uid().then(uid => {
        scope.setUser({ id: uid })
      })
    },
    debug: true,
  })

  return Launch(App, ...arguments)
}
