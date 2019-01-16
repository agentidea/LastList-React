import React, { Component } from 'react'
import styles from './SongList.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

class SongList extends Component {
  state = {}

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
  }

  render() {
    const { listItem } = this.props
    return (
      <div className={styles.row}>
        <span className={styles.gridWrap}>{listItem.artistName}</span>
        <span className={styles.gridWrap}>{listItem.songName}</span>
        <span className={styles.gridWrap}>
          <FontAwesomeIcon
            onClick={() => this.onEditSong(listItem)}
            className={styles.faIcon}
            icon={faPen}
          />
          <FontAwesomeIcon
            onClick={() => this.onRemoveSong(listItem)}
            className={styles.faIcon}
            icon={faTrashAlt}
          />
        </span>
      </div>
    )
  }
}

export default SongList
