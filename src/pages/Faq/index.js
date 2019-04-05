import React from 'react'
import styles from './Faq.module.css'
import main_styles from '../../App.module.css'
import gAnalyticsPageView from '../../common/utils/googleAnalytics'

const Faq = () => {
  gAnalyticsPageView()

  return (
    <div className={styles.content}>
      <div className={main_styles.plain_content}>
        <h3>FAQs</h3>

        <h4>1. What is a Last List?</h4>
        <p>
          A Last List is a playlist of songs that you create for your loved ones to remember you by
          when you die- it can be played at your memorial, funeral or wake, and shared with family
          and friends.
        </p>

        <h4>2. How does it work?</h4>
        <h5>How it works</h5>
        <ul>
          <li>Sign up. (We won’t share your information with anyone)</li>
          <li>Create a set of 10 songs for US $1.</li>
          <li>Add up to 5 guardians of your Last List.</li>
          <li>Finish up by paying via Stripe or Paypal.</li>
          <li>We’ll store your Last List and release it to your guardians.</li>
        </ul>

        <h4>3. How will my Last List be shared with my loved ones?</h4>

        <p>
          Once you’ve created your Last List, you have to choose up to 5 guardians. It’s their
          responsibility to get it from us when you’ve passed away.
        </p>
        <p>All they have to do is:</p>
        <ul>
          <li>Make a playlist of these songs</li>
          <li>Play it at your l end-of-life celebration</li>
          <li>Share it with the people you love</li>
        </ul>

        <h4>4. How much does a Last List cost?</h4>

        <p>
          A set of 10 songs is only $1. Your Last List can be made up of as many songs as you want.
        </p>

        <h4>5. What is a guardian?</h4>

        <p>
          A guardian is someone who is responsible for a Last List. They have to get their loved
          one’s Last List from us when the person dies.
        </p>

        <h4>6. What if I want to change my Last List or guardians?</h4>

        <p>You can edit your Last List and guardians as many times as you want.</p>
      </div>
    </div>
  )
}

export default Faq
