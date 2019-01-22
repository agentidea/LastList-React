import React, { Component } from 'react'
import styles from './SongAdd.module.css'
import Textfield from '../Textfield'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Button from '../Button'

class SongAdd extends Component {
  state = {
    artist: '',
    song: '',
    note: '',
    error: null,
    error_msg: null,
    hasError: false,
  }

  componentWillReceiveProps(nextProps, d) {
    if (JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return
    }

    const { artist, song, note } = nextProps
    this.setState({ artist: artist, song: song, note: note })
  }

  onChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  onSongAdd = () => {
    let { artist, song, note } = this.state
    const { onSongAdd } = this.props
    artist = artist.trim()
    song = song.trim()
    note = note ? note.trim() : ''

    if (artist === '' || song === '') {
      this.setState({ hasError: true, error_msg: 'Please add a song!' })
      return
    }

    let item = {
      artistName: artist,
      songName: song,
      note: note,
    }

    if (!this.validate_songs(item)) {
      this.setState({ hasError: true, error_msg: "You've already added this song." })
      return
    }

    this.setState({ hasError: false })

    onSongAdd(item)
    this.setState({ artist: '', song: '', note: '' })
  }

  validate_songs = needle => {
    const { lists } = this.props
    let list = lists[0]
    let track = list.find(
      item => item.artistName === needle.artistName && item.songName === needle.songName
    )

    return !track
  }

  render() {
    let { artist, song, note, error_msg, hasError } = this.state
    return (
      <div>
        <div className={styles.row}>
          <Textfield
            label={'Artist'}
            placeholder="Artist Name"
            value={artist}
            onChange={value => this.onChange('artist', value)}
          />
          <Textfield
            label={'Song Title'}
            placeholder="Song Title"
            value={song}
            onChange={value => this.onChange('song', value)}
          />
        </div>
        <Textfield
          label={'Reason Why (Explain why this song means a lot to you)'}
          placeholder="Notes"
          value={note}
          onChange={value => this.onChange('note', value)}
        />
        {hasError ? (
          <div className={styles.errorWrap}>
            <span className={styles.error}>{error_msg}</span>
          </div>
        ) : null}
        <div className={styles.addBtnWrap}>
          <Button className={styles.addBtn} onClick={this.onSongAdd}>
            Add
          </Button>
        </div>

        <div className={styles.searchBtnWrap}>
          <span onClick={this.props.toggleSearch}>
            Looking for a particular song?{' '}
            <FontAwesomeIcon className={styles.faIcon} icon={faSearch} />
          </span>
        </div>
      </div>
    )
  }
}

export default SongAdd
