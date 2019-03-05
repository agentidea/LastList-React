import React, { Component } from 'react'
import Button from '../../common/components/Button'
import styles from './Home.module.css'
import { HashLink } from 'react-router-hash-link'
import gAnalyticsPageView from '../../common/utils/googleAnalytics'
import { quotes } from '../../common/utils/quotes'
import grave from './music_grave.png'
import dead_guys from './dead_guys.png'

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
    const { quote } = this.state

    return (
      <div className={styles.content_wrap}>
        <div className={styles.text}>
          <div className={styles.content}>
            <h2>Say goodbye with songs</h2>
            <h4>Leave your ultimate playlist behind for your loved ones.</h4>

            <div className={styles.btn_grp}>
              <Button to="/signup" vspace>
                Create Your Last List
              </Button>
              <Button to="" vspace clear>
                <HashLink smooth to="/#lastlist">
                  What is Last List?
                </HashLink>
              </Button>
            </div>
          </div>

          <div className={styles.teal} id="lastlist">
            <div className={styles.content}>
              <div className={styles.ci_wrapper}>
                <div className={styles.ci_left}>
                  <img src={grave} alt="grave" width="192" />
                  <Button to="/signup" clear>
                    Create your Last List?
                  </Button>
                </div>
                <div className={styles.ci_right}>
                  <span className={styles.highlight_text}>
                    Last List is a selection of your favorite songs that you leave behind when you
                    die.
                  </span>

                  <p>
                    It’s your ultimate playlist that’s so much more than just a collection of tunes.
                    It’s a way to make sure the music you love is played at your end-of-life
                    celebration, and keep your memory alive in the minds of those you love, long
                    after you’ve passed away.
                  </p>
                </div>
              </div>

              <div className={styles.ci_wrapper}>
                <div className={`${styles.ci_left} ${styles.ci_left_lg}`}>
                  <img src={dead_guys} alt="listen" width="192" />
                </div>
                <div className={styles.ci_right}>
                  <span className={styles.highlight_text_2}>How it works</span>
                  <ul className={styles.list}>
                    <li className={styles.listItem}>
                      <span className={styles.listItemText}>
                        Sign up. (We won’t share your information with anyone)
                      </span>
                    </li>
                    <li className={styles.listItem}>
                      <span className={styles.listItemText}>
                        Create a set of 10 songs for US $1.
                      </span>
                    </li>
                    <li className={styles.listItem}>
                      <span className={styles.listItemText}>
                        Add up to 5 Guardians of your Last List.
                      </span>
                    </li>
                    <li className={styles.listItem}>
                      <span className={styles.listItemText}>
                        Finish up by paying via Stripe or PayPal.
                      </span>
                    </li>
                    <li className={styles.listItem}>
                      <span className={styles.listItemText} />
                      We’ll store your Last List and release it to your Guardians.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.greay}>
            <div className={styles.quotes}>
              <p>{quote.text}</p>
              <span> - {quote.credit}</span>
            </div>
            <Button to="/signup" vspace>
              Create Your Last List
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
