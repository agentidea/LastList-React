import ReactGA from 'react-ga'
import { environment } from '../../environment/environment'
ReactGA.initialize(environment.gAnalyticsKey)

function gAnalyticsPageView(page = null) {
  if (environment.mode === 'dev') {
    return null
  }

  page = page === null ? window.location.pathname + window.location.search : page
  ReactGA.pageview(page)
}

export default gAnalyticsPageView
