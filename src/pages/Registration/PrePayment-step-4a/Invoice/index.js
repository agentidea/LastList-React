import React, { Component } from 'react'
import styles from './Invoice.module.css'

export default class Invoice extends Component {
  render() {
    const { invoice } = this.props

    if (invoice === undefined) {
      return <div> no invoice </div>
    } else {
      return (
        <div>
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th>Songs</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {invoice.totalSongs} (${invoice.listCost} for 10 songs)
                </td>
                <td>${invoice.due}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
  }
}
