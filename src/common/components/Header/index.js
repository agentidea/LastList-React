import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import logo from './logo.png'

export default class Header extends Component {
  render() {
    const { isLoggedIn, isRegistered } = this.props
    return (
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/">
            <img src={logo} alt="Last List" width="120" height="131" />
          </Link>
        </div>
        <div className={styles.links}>
          {!isLoggedIn && <Link to="/guardian">Guardian Access</Link>}
          {Header.renderLogin(isLoggedIn, isRegistered)}
        </div>
      </header>
    )
  }

  static renderLogin(isLoggedIn, isRegistered) {
    const label = isLoggedIn ? 'Sign Out' : 'Sign In'
    return (
      <Fragment>
        {isLoggedIn &&
          isRegistered && (
            <Fragment>
              <Link to="/reg/create-profile">Profile</Link>
              <Link to="/reg/create-list">Your Last List</Link>
              <Link to="/reg/add-guardian">Your Guardians</Link>
            </Fragment>
          )}
        <Link to={isLoggedIn ? '/sign-out' : '/login'}>{label}</Link>
      </Fragment>
    )
  }
}
