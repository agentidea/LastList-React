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
          <p>
            Music connects us all on deeply emotional level. Just a few familiar chords can take you
            straight back to another place and time.
          </p>
          <p>
            Last List is a playlist you create for your loved ones to you remember you by - a
            selection of your favorite songs that can be played at your memorial, wake or funeral,
            and shared with those you care about when you’re no longer around.
          </p>
          <p>
            It’s a chance for you to leave family and friends with a lasting musical testimonial of
            your life.
          </p>
          <div className={styles.spaceHack}>&nbsp;</div>
          <Button to="/signup" vspace>
            Create Your Last List
          </Button>
          <div className={styles.spaceHack}>&nbsp;</div>
          <h3>HOW IT WORKS</h3>
          <h4>It's easy to create your Last List</h4>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>Sign up and create your Last List</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>
                Add a set of 10 songs for $1. You can have as many sets as you want.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>
                Add the names of up to 5 Guardians of your list. We’ll let them know they’ve been
                chosen and what they have to do to when you’ve passed away.
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
                Finish up by checking out with a credit card or Apple Pay.
              </span>
            </li>
          </ul>
        </div>
        <div className={styles.links}>
          <Link to="/signup">Create Your Last List</Link>
          <Link to="/faq">Questions?</Link>
        </div>
      </div>
    )
  }
}

export default Home
