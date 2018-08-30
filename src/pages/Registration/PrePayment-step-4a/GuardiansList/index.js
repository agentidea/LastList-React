import React, { Component } from 'react'
import styles from './GuardiansList.module.css'

export default class GuardiansList extends Component {
  render() {
    const { guardians } = this.props
    return (
      <div>
        <h4>Your Guardians</h4>

        <table className={styles.guardianTable}>
          <tbody>
            {guardians.map(g => (
              <tr key={g.uuid}>
                <td>{g.firstName}</td>
                <td>{g.lastName}</td>
                <td>{g.email}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul />
      </div>
    )
  }
}
