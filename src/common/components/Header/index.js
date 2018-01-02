import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import logo from './logo.png'

export default class Header extends Component {
  render() {
    const { isLoggedIn } = this.props
    return (
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/">
            <img src={logo} alt="Last List" width="120" height="131" />
          </Link>
        </div>
        <div className={styles.links}>
          {!isLoggedIn && <Link to="/guardian">Guardian Access</Link>}
          {this.renderLogin(isLoggedIn)}
        </div>
      </header>
    )
  }

  renderLogin(isLoggedIn) {
    const label = isLoggedIn ? 'Sign Out' : 'Sign In'
    return (
      <div>
        {isLoggedIn && <Link to="/edit-list">Your list</Link>}
        <Link to="/login">{label}</Link>
      </div>
    )
  }
}
