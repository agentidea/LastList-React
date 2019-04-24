import ReactGA from 'react-ga'
import { environment } from '../../environment/environment'
ReactGA.initialize(environment.gAnalyticsKey)

let gAnalytics = {
  /**
   * G-Analytics Page Views
   * @param page
   * @returns {null}
   */
  gAnalyticsPageView: (page = null) => {
    if (environment.mode === 'dev') {
      return null
    }

    page = page === null ? window.location.pathname + window.location.search : page
    ReactGA.pageview(page)
  },

  /**
   * G-Analytics Events
   * @param event_type
   * @param event_data
   * @returns {null}
   */
  gAnalyticsEvents: (event_data, event_type = 'send') => {
    if (environment.mode === 'dev') {
      return null
    }
    ReactGA.ga(event_type, {
      hitType: 'event',
      eventCategory: event_data.category,
      eventAction: event_data.action,
      eventLabel: event_data.label,
    })
  },
}

export default gAnalytics
