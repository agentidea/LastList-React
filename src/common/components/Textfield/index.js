import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './Textfield.module.css'

export default class Textfield extends Component {
  onInput = event => {
    if (typeof this.props.onInput === 'function') {
      this.props.onInput(event.target.value)
    }
  }

  render() {
    const { type = 'text', label, className, error, help, ...rest } = this.props
    return (
      <div className={classnames(styles.textfield, className)}>
        <label className={styles.label}>{label}</label>
        <input
          className={classnames(styles.input, error && styles.inputError)}
          type={type}
          {...rest}
          onInput={this.onInput}
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
