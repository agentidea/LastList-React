import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export class Footer extends Component {
  render() {
    return (
      <footer className={styles.footer}>
        <div className={styles.left}>
          <Link to="">Last List &copy; Copyright {new Date().getFullYear()} | </Link>
          <Link to="/policies">Policies | </Link>
          <Link to="/terms">Terms and Conditions | </Link>
          <Link to="/faq">FAQs</Link>
        </div>
        <div className={styles.right}>
          <Link to="mailto:contact@lastlist.com">contact@lastlist.com</Link>
        </div>
      </footer>
    )
  }
}

export default Footer
