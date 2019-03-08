import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import styles from './Header.module.css'
import logo from './logo.png'

export default class Header extends Component {
  render() {
    const { isLoggedIn, isRegistered } = this.props

    return (
      <div>
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <Link to="/">
              <img src={logo} alt="Last List" width="120" height="131" />
            </Link>
          </div>
          <div className={styles.links}>
            {!isLoggedIn && (
              <div>
                <HashLink smooth to="/#lastlist">
                  What is Last List?
                </HashLink>
                <Link to="/signup">Create your List</Link>
                <Link to="/guardian">Guardians</Link>
                <Link to="/login">Sign in</Link>
              </div>
            )}
            {isLoggedIn && <Link to="/sign-out">Sign out</Link>}
          </div>
        </header>
        <div className={styles.subheader}>{Header.renderLogin(isLoggedIn, isRegistered)}</div>
      </div>
    )
  }

  static renderLogin(isLoggedIn, isRegistered) {
    return (
      <Fragment>
        {isLoggedIn &&
          isRegistered && (
            <Fragment>
              <Link to="/reg/create-profile">Your Profile</Link>
              <Link to="/reg/create-list">Your Last List</Link>
              <Link to="/reg/add-guardian">Your Guardians</Link>
            </Fragment>
          )}
      </Fragment>
    )
  }
}
