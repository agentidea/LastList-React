import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../common/components/Button'
import styles from './Home.module.css'
import gAnalyticsPageView from '../../common/utils/googleAnalytics'

export class Home extends Component {
  componentDidMount() {
    gAnalyticsPageView()
  }

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.text}>
          <h2>Say goodbye with songs</h2>
          <p>
            Music connects us all on a deeply emotional level. A few familiar chords can remind you
            of the most important people, places and times in your life.
          </p>
          <p>
            Last List is a playlist of your favorite songs you leave behind when you pass away. It
            can be played at your memorial, wake or funeral, and shared with the people you love.
            It's a unique soundtrack of your life and an amazing way for people to remember you when
            you’re gone.
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
                Add the names of up to 5 Guardians of your playlist. We’ll let them know they’ve
                been chosen and what they have to do when you leave this world.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>
                Finish up by checking out with a credit card or Apple Pay.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText} />
              We’ll store your Last List for you. You can edit your songs and Guardians whenever you
              feel like it.
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
