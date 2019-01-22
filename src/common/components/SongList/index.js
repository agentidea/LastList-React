import React, { Component } from 'react'
import styles from './SongList.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

class SongList extends Component {
  state = {
    should_show: false,
  }

  onEditSong = item => {
    let obj = {
      artist: item.artistName,
      title: item.songName,
      note: item.note,
    }
    this.props.removeSong(item)
    this.props.fromSearchAddSong(obj)
  }

  onRemoveSong = item => {
    this.props.removeSong(item)
    this.closePrompt()
  }

  toDelete = () => {
    this.setState({ should_show: true })
  }

  closePrompt = () => {
    this.setState({ should_show: false })
  }

  render() {
    const { listItem } = this.props
    const { should_show } = this.state
    return (
      <div className={styles.row}>
        <div className={styles.deletePrompt} style={{ display: should_show ? '' : 'none' }}>
          <span>Are you sure ?</span>
          <div className={styles.smBtnWrap}>
            <a className={styles.smBtnApprove} onClick={() => this.onRemoveSong(listItem)}>
              Yes
            </a>{' '}
            |&nbsp;
            <a className={styles.smBtnDeny} onClick={this.closePrompt}>
              Cancel
            </a>
          </div>
        </div>

        <span className={styles.gridWrap}>{listItem.artistName}</span>
        <span className={styles.gridWrap}>{listItem.songName}</span>
        <span className={styles.gridWrap}>
          <FontAwesomeIcon
            onClick={() => this.onEditSong(listItem)}
            className={styles.faIcon}
            icon={faPen}
          />
          <FontAwesomeIcon
            onClick={() => this.toDelete()}
            className={styles.faIcon}
            icon={faTrashAlt}
          />
        </span>
      </div>
    )
  }
}

export default SongList
