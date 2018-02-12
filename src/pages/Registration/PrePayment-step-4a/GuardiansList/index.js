import React, { Component } from 'react'
import styles from './GuardiansList.module.css'

export default class GuardiansList extends Component {
  render() {
    const { guardians } = this.props
    return (
      <div>
        <h4>Your Guardians</h4>

        <ul>
          {guardians.map(g => (
            <li key={g.uuid}>
              {g.firstName} {g.lastName} {g.email}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
