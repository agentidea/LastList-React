import React from 'react'
import styles from './Faq.module.css'

const Faq = () => {
  return (
    <div className={styles.content}>
      <h3>Here are some answers to your Frequently Asked Questions</h3>

      <h4>1. What is a Last List?</h4>
      <p>
        A Last List is a playlist of songs that you create for your loved ones to remember you by
        when you are no longer around - it can be played at your memorial, funeral or wake, and
        shared with family and friends.
      </p>

      <h4>2. How does it work?</h4>
      <ul>
        <li>Sign up and create your Last List</li>
        <li>Add a set of 10 songs for 99c. You can have as many sets as you want.</li>
        <li>
          Give us the names of up to 5 Guardians of your list. We’ll let them know they’ve been
          chosen and what they have to do to when you’ve passed away.
        </li>
        <li>
          You can edit your Last List and Guardian(s) whenever you feel like it. We’ll store your
          Last List for you until the time has come.
        </li>
        <li>Finish up by checking out with PayPal or Apple Pay.</li>
      </ul>

      <h4>3. How will my Last List be shared with my loved ones?</h4>

      <p>
        Once you’ve created your Last List, you have to choose up to 5 Guardians. It’s their
        responsibility to share your Last List when you’ve passed away.
      </p>

      <h4>4. How much does a Last List cost?</h4>

      <p>
        A set of 10 songs is only 99c. Your Last List can be made up of as many sets as you want.
      </p>

      <h4>5. What is a Guardian?</h4>

      <p>
        Once you’ve created your Last List, you have to choose up to 5 Guardians - people who will
        be responsible for getting your list from us when the time has come.
      </p>

      <h4>6. What if I want to change my Last List or Guardians?</h4>

      <p>You can edit your Last List and Guardians as many times as you want to.</p>
    </div>
  )
}

export default Faq
