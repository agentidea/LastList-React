import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import styles from './Header.module.css'
import logo from './logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

export default class Header extends Component {
  state = {
    toggle_icon: true,
  }

  toggle_menu = () => {
    let { toggle_icon } = this.state
    this.setState({ toggle_icon: !toggle_icon })
  }

  render() {
    const { isLoggedIn, isRegistered } = this.props
    let { toggle_icon } = this.state

    return (
      <div>
        <header className={styles.header}>
          <div className={styles.hamburger_menu}>
            <FontAwesomeIcon
              onClick={this.toggle_menu}
              className={styles.faIcon}
              icon={faBars}
              style={{ display: toggle_icon ? 'block' : 'none' }}
            />
            <FontAwesomeIcon
              onClick={this.toggle_menu}
              className={styles.faIcon}
              icon={faTimes}
              style={{ display: toggle_icon ? 'none' : 'block' }}
            />
          </div>
          <div className={styles.logoContainer}>
            <Link to="/">
              <img src={logo} alt="Last List" width="120" height="131" />
            </Link>
          </div>
          <div
            className={`${styles.links} ${
              toggle_icon ? styles.mobi_hide_menu : styles.mobi_show_menu
            }`}
          >
            {!isLoggedIn && (
              <div>
                <HashLink smooth to="/#lastlist">
                  What is Last List?
                </HashLink>
                <Link to="/signup">Create your List</Link>
                <Link to="/#">Blog</Link>
                <Link to="/guardian">Guardians</Link>
                <Link to="/login">Sign in</Link>
              </div>
            )}
            {isLoggedIn && Header.renderLogin(isLoggedIn, isRegistered)}
          </div>
        </header>
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
              <Link to="/sign-out">Sign out</Link>
            </Fragment>
          )}
      </Fragment>
    )
  }
}
