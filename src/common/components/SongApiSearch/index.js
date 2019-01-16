import React, { Component } from 'react'
import debounce from 'lodash.debounce'
import { Howl } from 'howler'

import styles from './SongApiSearch.module.css'
import Textfield from '../Textfield'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPlusCircle, faStop, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { search } from '../../utils/spotifyApi'

class SongApiSearch extends Component {
  state = {
    query: '',
    results: null,
    playing: null,
    popupOpen: false,
  }
  player = null

  componentWillReceiveProps(nextProps, d) {
    this.setState({ popupOpen: nextProps.openSearch, query: '', results: '' })
    this.stopPlayer()
  }

  componentWillUnmount() {
    this.stopPlayer()
  }

  handleClose = () => {
    this.stopPlayer()
    this.props.toggleSearch()
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
    this.props.toggleSearch()
    this.props.fromSearchAddSong(result)
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
    this.props.toggleSearch()
  }

  render() {
    const open = this.state.popupOpen
    const { playing } = this.state

    return (
      <div className={styles.popupWrapper} style={{ display: !open ? 'none' : '' }}>
        <div className={styles.popup}>
          <div className={styles.closeWrap}>
            <span onClick={this.closePopup}>
              <FontAwesomeIcon className={styles.faIconClose} icon={faTimesCircle} />
            </span>
          </div>
          <Textfield
            id="search-field"
            placeholder="Search for a song..."
            type="search"
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
                      <div className={styles.trackText}>
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
                        <FontAwesomeIcon
                          className={styles.faIcon}
                          icon={faPlusCircle}
                          color="primary"
                          aria-label="Add"
                          onClick={() => this.onAddSong(result)}
                        />
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
