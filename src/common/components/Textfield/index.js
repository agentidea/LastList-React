import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './Textfield.module.css'

export default class Textfield extends Component {
  onChange = event => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event.target.value, event)
    }
  }

  render() {
    const { type = 'text', label, className, error, help, innerRef, ...rest } = this.props
    return (
      <div className={classnames(styles.textfield, className)}>
        <label className={styles.label}>{label}</label>
        <input
          className={classnames(styles.input, error && styles.inputError)}
          type={type}
          ref={innerRef}
          {...rest}
          onChange={this.onChange}
        />
        {error ? (
          <span className={classnames(styles.help, styles.helpError)}>{error}</span>
        ) : (
          <span className={styles.help}>{this.props.help}</span>
        )}
      </div>
    )
  }
}
