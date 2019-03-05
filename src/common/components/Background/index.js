import React, { Component } from 'react'
import styles from './Background.module.css'

export default class BackgroundAnimation extends Component {
  render() {
    return (
      <div className={styles.background}>
        {Array.from({ length: 100 }, (item, key) => <span key={key} />)}
      </div>
    )
  }
}
