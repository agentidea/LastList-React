import React, { Component } from 'react'
import debounce from 'lodash.debounce'
import { Howl } from 'howler'

import styles from './SongApiSearch.module.css'
import Textfield from '../Textfield'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop, faTimes } from '@fortawesome/free-solid-svg-icons'
import { search } from '../../utils/spotifyApi'

class SongApiSearch extends Component {
  state = {
    query: '',
    results: null,
    playing: null,
    show_search: false,
  }
  player = null

  componentWillReceiveProps(nextProps, d) {
    this.setState({ show_search: nextProps.show_search, query: nextProps.artist_song, results: '' })
    this.stopPlayer()
    if (nextProps.artist_song.trim() !== '') {
      this.handleQueryChange(nextProps.artist_song.trim())
    }
  }

  componentWillUnmount() {
    this.stopPlayer()
  }

  handleClose = value => {
    this.stopPlayer()
    setTimeout(() => {
      this.setState({ show_search: value })
    }, 200)
  }

  handleQueryChange = query => {
    this.stopPlayer()
    this.setState({ query })
    if (query && query.length >= 2) {
      this.onSearch(query)
    } else {
      this.setState({ results: null })
    }
  }

  onSearch = debounce(async query => {
    this.setState({
      results: null,
    })
    try {
      const response = await search(query)
      this.setState({
        results:
          response.tracks !== undefined
            ? response.tracks.items.map(item => ({
                id: item.id,
                title: item.name,
                artist: item.artists && item.artists[0] && item.artists[0].name,
                preview_url: item.preview_url,
              }))
            : [],
      })
    } catch (e) {
      console.error(e)
    }
  }, 300)

  onAddSong = result => {
    this.props.fillArtistSong(result)
    this.handleClose(false)
  }

  onPlay = result => {
    this.stopPlayer()
    this.player = new Howl({
      src: [result.preview_url],
      format: ['mp3'],
    })
    this.player.play()
    this.setState({ playing: result.id })
  }

  stopPlayer = () => {
    this.setState({ playing: null })
    if (this.player) {
      this.player.unload()
      this.player = null
    }
  }

  closePopup = () => {
    this.stopPlayer()
    this.setState({ results: null })
  }

  render() {
    const { playing, results, show_search } = this.state

    return (
      <div
        className={styles.popupWrapper}
        style={{ visibility: !results || !show_search ? 'hidden' : 'visible' }}
      >
        <div className={styles.popup}>
          <div className={styles.closeWrap}>
            <span onClick={this.closePopup}>
              <FontAwesomeIcon className={styles.faIconClose} icon={faTimes} />
            </span>
          </div>
          <Textfield
            id="search-field"
            placeholder="Search for a song..."
            type="hidden"
            color="primary"
            value={this.state.query}
            onChange={value => this.handleQueryChange(value)}
          />

          <div>
            {this.state.results ? (
              this.state.results.length === 0 ? (
                <div className={styles.noResult}>No result</div>
              ) : (
                <div>
                  {this.state.results.map(result => (
                    <div className={styles.eachItem} key={result.id}>
                      <div className={styles.trackText} onClick={() => this.onAddSong(result)}>
                        {result.title}
                        <br />
                        <small>{result.artist}</small>
                      </div>
                      <div className={styles.iconsWrap}>
                        {result.preview_url &&
                          (playing === result.id ? (
                            <FontAwesomeIcon
                              className={styles.faIcon}
                              icon={faStop}
                              aria-label="Stop"
                              onClick={() => this.stopPlayer()}
                            />
                          ) : (
                            <FontAwesomeIcon
                              className={styles.faIcon}
                              icon={faPlay}
                              aria-label="Play"
                              onClick={() => this.onPlay(result)}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

export default SongApiSearch
