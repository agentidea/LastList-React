import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export class Footer extends Component {
  render() {
    return (
      <footer className={styles.footer}>
        <div className={styles.left}>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/policies">Policies</Link>
          <Link to="/terms">Terms and Conditions</Link>
        </div>
        <div className={styles.right}>Last List &copy; Copyright 2018</div>
      </footer>
    )
  }
}

export default Footer
