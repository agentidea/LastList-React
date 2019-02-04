import React, { Component } from 'react'
import Cleave from 'cleave.js/react'
import classnames from 'classnames'
import styles from '../Textfield/Textfield.module.css'
import dateFns from 'date-fns'

class DateOfBirthSelector extends Component {
  state = { error: null }

  onDateChange = event => {
    let rawDate = event.target.value
    const regex = /^\d{4}\/\d{2}\/\d{2}$/

    this.setState({ error: null })

    if (rawDate.trim() === '') {
      this.props.onChange(null)
      return
    }

    if (!regex.test(rawDate)) {
      this.setState({ error: 'Date format is incorrect' })
      this.props.onChange(null)
      return
    }

    if (!this.validateDate(rawDate)) {
      this.props.onChange(null)
    }

    const dob = dateFns.format(rawDate, 'YYYY/MM/DD')
    this.props.onChange(dob)
  }

  validateDate = bdate => {
    let bdate_year = dateFns.format(bdate, 'YYYY')
    let cur_year = dateFns.format(new Date(), 'YYYY')
    let age = cur_year - bdate_year

    if (age < 10) {
      this.setState({ error: 'You have to be older than 10 years to use this service' })
      return false
    }
    if (age > 120) {
      this.setState({ error: ' You have to be younger than 120 years to use this service' })
      return false
    }

    return true
  }

  render() {
    const { label, noMargin, className, ...rest } = this.props
    const { error } = this.state

    return (
      <div className={classnames(styles.textfield, className, noMargin && styles.noMargin)}>
        <label className={styles.label}>{label}</label>
        <Cleave
          className={classnames(styles.input, error && styles.inputError)}
          placeholder={this.props.placeholder}
          options={{ date: true, datePattern: ['Y', 'm', 'd'] }}
          onChange={this.onDateChange}
          value={this.props.value}
        />
        {error ? (
          <span className={classnames(styles.help, styles.helpError)}>{error}</span>
        ) : (
          this.props.help && <span className={styles.help}>{this.props.help}</span>
        )}
      </div>
    )
  }
}

export default DateOfBirthSelector
