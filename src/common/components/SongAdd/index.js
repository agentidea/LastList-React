import React, { Component } from 'react'
import styles from './SongAdd.module.css'
import Textfield from '../Textfield'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Button from '../Button'
import SongApiSearch from '../SongApiSearch'

class SongAdd extends Component {
  state = {
    artist: '',
    song: '',
    note: '',
    error: { field: null, error: null },
    error_msg: null,
    hasError: false,
    artist_song: '',
    show_search: false,
  }

  componentWillReceiveProps(nextProps, d) {
    if (JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return
    }

    const { artist, song, note } = nextProps

    this.setState({ artist: artist, song: song, note: note, hasError: false, error_msg: null })
    this.fillArtistSong(nextProps)
  }

  onChange = (field, value, display_name?: null) => {
    this.setState({ [field]: value, error: { field: null } })
    if (value.trim() === '') {
      this.setState({ error: { field: field, error: `Oops! Missing ${display_name}` } })
    }
    this.makeArtistSong(field, value)
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
    this.setState({ artist: '', song: '', note: '', artist_song: '' })
  }

  makeArtistSong = (field, value) => {
    if (field === 'artist_song') {
      let artist_song = value.split('-')
      if (artist_song.length >= 2 && artist_song[0].trim() !== '' && artist_song[1].trim() !== '') {
        this.setState({ artist: artist_song[0].trim(), song: artist_song[1].trim() })
        return
      }
      this.handleClose(false)
    }
  }

  fillArtistSong = item => {
    this.setState({
      artist: item === null ? '' : item.artist,
      song: item === null ? '' : item.title || item.song,
      note: item === null ? '' : item.note,
      artist_song:
        item.artist && (item.title || item.song)
          ? item.artist + ' - ' + (item.title || item.song)
          : '',
    })
  }

  validate_songs = needle => {
    const { lists } = this.props
    let list = lists[0]
    let track = list.find(
      item => item.artistName === needle.artistName && item.songName === needle.songName
    )

    return !track
  }
  handleClose = value => {
    this.setState({ show_search: value })
  }

  render() {
    const { show_add_more } = this.props
    let { artist_song, note, error_msg, hasError, error } = this.state
    return (
      <div className={styles.song_add}>
        <div style={{ display: show_add_more ? 'none' : '' }}>
          <div className={styles.row}>
            <div className={styles.artist_song}>
              <FontAwesomeIcon className={styles.faIcon} icon={faSearch} />
              <Textfield
                className={styles.tx_1}
                placeholder="Enter artist and song name e.g (Artist - Song Title)"
                value={artist_song}
                error={error.field === 'artist_song' ? error.error : null}
                onChange={value => this.onChange('artist_song', value, 'Artist / Song Title')}
                onKeyUp={() => this.handleClose(true)}
              />
              <SongApiSearch {...this.state} fillArtistSong={this.fillArtistSong} />
            </div>
          </div>
          <Textfield
            label="Why this song?"
            placeholder="Explain why this song means a lot to you in 250 words."
            value={note}
            onChange={value => this.onChange('note', value)}
            onKeyUp={() => this.handleClose(false)}
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
              Add song
            </Button>
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
