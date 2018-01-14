import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../common/components/Button'
import styles from './Home.module.css'

export class Home extends Component {
  render() {
    return (
      <div className={styles.content}>
        <div className={styles.text}>
          <h2>Say goodbye with songs</h2>
          <h3 className={styles.subtitle}>
            Create a playlist for your loved ones to remember you by.
          </h3>
          <p>
            Music connects us all on deeply emotional level. Just the opening chords of a song can
            conjure up memories and take you straight back to another place and time.
          </p>
          <p>
            Last List is a selection of your favorite songs that can be played at your memorial,
            wake or funeral, and shared with those you care about when you’re no longer around. It’s
            chance for you to leave family and friends with a lasting musical testimonial of your
            life.
          </p>
          <Button to="/signup" vspace>
            Create Your List
          </Button>
          <h4>How it works</h4>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>Sign up and create your Last List</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>
                Add a set of 10 songs for 99c. You can have as many sets as you want, it’s totally
                up to you.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>
                Give us the names of up to 5 Guardians of your list. We’ll let them know they’ve
                been chosen and what they have to do to when you’ve passed away.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>
                You can edit your Last List and Guardian(s) whenever you feel like it. We’ll store
                your Last List for you until the time has come.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>
                Finish up by checking out with PayPal or Apple Pay.
              </span>
            </li>
          </ul>
        </div>
        <div className={styles.links}>
          <Link to="/signup">Create your Last List</Link>
          <Link to="/faq">Questions?</Link>
        </div>
      </div>
    )
  }
}

export default Home
