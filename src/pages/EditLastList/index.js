import React, { Component } from 'react'
import requireLogin from '../../common/hocs/requireLogin'
import styles from './EditLastList.module.css'

export class EditLastList extends Component {
  render() {
    return <div>Edit last list</div>
  }
}

export default requireLogin(EditLastList)
