import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import debounce from 'lodash.debounce'
import Paper from 'material-ui/Paper'

import Textfield from '../Textfield'
import * as lastFmApi from '../../utils/lastFmApi'
import styles from './SongInput.module.css'

const renderInput = ({ onChange, ref, ...rest }) => (
  <Textfield
    noMargin
    onChange={(v, e) => onChange(e)} // autosuggest needs to original event
    innerRef={ref}
    {...rest}
  />
)

const renderSuggestion = suggestion => {
  return (
    <div>
      {suggestion.artist} - {suggestion.title}
    </div>
  )
}

const renderSuggestionsContainer = ({ containerProps, children }) => (
  <Paper {...containerProps} square>
    {children}
  </Paper>
)

export class SongInput extends Component {
  state = {
    suggestions: [],
  }

  onArtistChange = (event, { newValue }) => {
    const { onArtistChange } = this.props
    onArtistChange(newValue)
  }

  fetchSuggestions = async ({ value }) => {
    const suggestions = await lastFmApi.search(value)
    this.setState({
      suggestions,
    })
  }
  debouncedFetchSuggestions = debounce(this.fetchSuggestions, 300)

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  onSuggestionSelected = (e, { suggestion }) => {
    e.preventDefault() // we don't want to raise an onSubmit event in this case
    this.props.onBothChanged({ artist: suggestion.artist, song: suggestion.title })
  }

  render() {
    const { isFirst, artistName, songName, onSongChange } = this.props
    return (
      <div className={styles.row}>
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.debouncedFetchSuggestions}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          renderInputComponent={renderInput}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={suggestion => suggestion.artist}
          renderSuggestion={renderSuggestion}
          inputProps={{
            value: artistName,
            label: isFirst ? 'Artist Name' : null,
            placeholder: 'Artist Name',
            onChange: this.onArtistChange,
          }}
          theme={{
            container: styles.autoSuggestContainer,
            suggestionsContainerOpen: styles.suggestionsContainerOpen,
            suggestionsList: styles.suggestionsList,
            suggestion: styles.suggestion,
            suggestionHighlighted: styles.suggestionHighlighted,
          }}
        />
        <Textfield
          label={isFirst ? 'Song Title' : null}
          placeholder="Song Title"
          value={songName}
          onChange={onSongChange}
        />
      </div>
    )
  }
}

export default SongInput
