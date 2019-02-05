import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../common/components/Button'
import styles from './Home.module.css'
import gAnalyticsPageView from '../../common/utils/googleAnalytics'
import { quotes } from '../../common/utils/quotes'

export class Home extends Component {
  componentDidMount() {
    gAnalyticsPageView()
    setInterval(() => {
      this.showQuote()
    }, 7000)
  }

  state = {
    counter: 0,
    footer_counter: Math.floor(Math.random() * quotes.footer.length),
    quote: quotes.header[3],
  }

  showQuote = () => {
    const { counter } = this.state
    let next = quotes.header.length > counter ? counter : 0
    this.setState({ counter: next + 1, quote: quotes.header[next] })
  }

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.text}>
          <h2>Say goodbye with songs</h2>

          <div className={styles.quotes}>
            <p>{this.state.quote}</p>
          </div>

          <p>
            Last List is a selection of your favorite songs that you leave behind when you die. It’s
            your ultimate playlist that’s so much more than just a collection of tunes. It’s a way
            to make sure the music you love is played at your end-of-life celebration, and keep your
            memory alive in the minds of those you love, long after you’ve passed away.
          </p>

          <div className={styles.spaceHack}>&nbsp;</div>
          <Button to="/signup" vspace>
            Create Your Last List
          </Button>
          <div className={styles.spaceHack}>&nbsp;</div>
          <h3 className={styles.h3}>HOW IT WORKS</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>
                Sign up. (We won’t share your information with anyone)
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>Create a set of 10 songs for US $1.</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>Add up to 5 Guardians of your Last List.</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText}>Finish up by paying via Stripe or PayPal.</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.listItemText} />
              We’ll store your Last List and release it to your Guardians.
            </li>
          </ul>
        </div>
        <div className={styles.links}>
          <Link to="/signup">Create Your Last List</Link>
          <Link to="/faq">Questions?</Link>
        </div>

        <div className={styles.footer_quotes}>
          <p>{quotes.footer[this.state.footer_counter]}</p>
        </div>
      </div>
    )
  }
}

export default Home
