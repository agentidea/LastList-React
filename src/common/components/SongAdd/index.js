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
    error: { field: null, error: null },
    error_msg: null,
    hasError: false,
  }

  componentWillReceiveProps(nextProps, d) {
    if (JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return
    }

    const { artist, song, note } = nextProps
    this.setState({ artist: artist, song: song, note: note, hasError: false, error_msg: null })
  }

  onChange = (field, value, display_name?: null) => {
    this.setState({ [field]: value, error: { field: null } })
    if (value.trim() === '') {
      this.setState({ error: { field: field, error: `Oops! Missing ${display_name}` } })
    }
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
    const { show_add_more } = this.props
    let { artist, song, note, error_msg, hasError, error } = this.state
    return (
      <div>
        <div style={{ display: show_add_more ? 'none' : '' }}>
          <div className={styles.row}>
            <Textfield
              label={'Artist'}
              placeholder="Artist Name"
              value={artist}
              error={error.field === 'artist' ? error.error : null}
              onChange={value => this.onChange('artist', value, 'Artist Name')}
            />
            <Textfield
              label={'Song Title'}
              placeholder="Song Title"
              value={song}
              error={error.field === 'song' ? error.error : null}
              onChange={value => this.onChange('song', value, 'Song Title')}
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
              <span className={styles.error} dangerouslySetInnerHTML={{ __html: error_msg }} />
            </div>
          ) : null}
          <div className={styles.addBtnWrap}>
            <Button
              className={`${styles.addBtn} ${show_add_more ? styles.inactive : ''}`}
              onClick={this.onSongAdd}
            >
              Add
            </Button>
          </div>

          <div className={styles.searchBtnWrap}>
            <span
              onClick={this.props.toggleSearch}
              className={show_add_more ? styles.inactive : ''}
            >
              Looking for a particular song?{' '}
              <FontAwesomeIcon className={styles.faIcon} icon={faSearch} />
            </span>
          </div>
        </div>

        {show_add_more ? (
          <div className={styles.notice}>
            <h5>
              Please click on the "<b>Add Another 10 songs</b>" button OR proceed to the payment
              page by clicking the "<b>Next</b>" button
            </h5>
          </div>
        ) : null}
      </div>
    )
  }
}

export default SongAdd
