import React, { Component } from 'react'
import styles from './SongList.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

class SongList extends Component {
  state = {
    should_show: false,
    show_comment: false,
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

  show_comment = () => {
    let { show_comment } = this.state
    this.setState({ show_comment: !show_comment })
  }

  render() {
    const { listItem, controls } = this.props
    const { should_show, show_comment } = this.state
    return (
      <div className={styles.all_wrap}>
        <div
          className={styles.row}
          style={{ gridTemplateColumns: !controls ? '1fr 2fr 0.1fr' : '1fr 2fr 0.1fr 1fr' }}
        >
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
              onClick={this.show_comment}
              className={styles.faIcon}
              icon={faComment}
            />
          </span>
          <span className={styles.gridWrap} style={{ display: controls ? '' : 'none' }}>
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
        <div
          className={
            show_comment ? `${styles.tooltip} ${styles.show_comment}` : `${styles.tooltip}`
          }
        >
          <span className={styles.tooltiptext}>
            {listItem.note === '' ? 'No comment' : listItem.note}
          </span>
        </div>
      </div>
    )
  }
}

export default SongList
