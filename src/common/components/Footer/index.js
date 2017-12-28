import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export class Footer extends Component {
  render() {
    return (
      <footer class={styles.footer}>
        <div className={styles.left}>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className={styles.right}>Last List &copy; Copyright 2017</div>
      </footer>
    )
  }
}

export default Footer
