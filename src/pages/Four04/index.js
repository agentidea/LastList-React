import React from 'react'
import Button from '../../common/components/Button'
import styles from './Four04.module.css'

const Four04 = () => {
  return (
    <div className={styles.center}>
      <h3>Page not found</h3>
      <p>This page doesn't exist.</p>
      <Button to="/">Go back home</Button>
    </div>
  )
}

export default Four04
