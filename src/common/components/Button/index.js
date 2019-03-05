import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import styles from './Button.module.css'

/**
 * Props:
 *   nonprimary {boolean=} "Primary" is default.
 *   vpsace {boolean=} Adds extra vertical margin space.
 */
export default class Button extends Component {
  render() {
    const { to, nonprimary, vspace, className, children, clear, ...rest } = this.props
    const classes = classnames(
      styles.button,
      nonprimary && styles.nonprimary,
      vspace && styles.vspace,
      clear && styles.clear,
      className
    )

    return to ? (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    ) : (
      <button className={classes} {...rest}>
        {children}
      </button>
    )
  }
}
