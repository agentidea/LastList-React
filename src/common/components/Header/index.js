import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import logo from './logo.png'

export default class Header extends Component {
  render() {
    const { isLoggedIn, isRegistered } = this.props
    const label = isLoggedIn ? 'Sign Out' : 'Sign In'
    return (
      <div>
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <Link to="/">
              <img src={logo} alt="Last List" width="120" height="131" />
            </Link>
          </div>
          <div className={styles.links}>
            {!isLoggedIn && <Link to="/guardian">Guardian Access</Link>}
            {<Link to={isLoggedIn ? '/sign-out' : '/login'}>{label}</Link>}
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
