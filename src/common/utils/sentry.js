import * as Sentry from '@sentry/browser'
import { environment } from '../../environment/environment'

function sentryWatcher() {
  let report = null
  if (environment.mode === 'prod') {
    report = Sentry.init({
      dsn: environment.sentryDSN,
    })
  }

  return report
}

export default sentryWatcher
