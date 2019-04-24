import React from 'react'
import { Link } from 'react-router-dom'
import gAnalytics from '../../common/utils/googleAnalytics'

const Contact = () => {
  gAnalytics.gAnalyticsPageView()

  return (
    <div>
      <h3>Contact Us</h3>
      <p>
        If you have any questions, please take a look at our <Link to="/faq">FAQs</Link> or email us
        at{' '}
        <a href="mailto:contact@lastlist.com?subject=LastList%20Contact%20Request">
          contact@lastlist.com
        </a>.
      </p>
    </div>
  )
}

export default Contact
