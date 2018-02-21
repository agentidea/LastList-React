import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import requireLogin from '../../../common/hocs/requireLogin'
import * as listsActionCreators from '../../../common/state/lists/actions'
import Loading from '../../../common/components/Loading'
import Textfield from '../../../common/components/Textfield'
import Button from '../../../common/components/Button'
import styles from './EditLastList.module.css'

const mapStateToProps = state => ({
  lists: state.lists.lists,
  loading: state.lists.loading,
  saving: state.lists.saving,
  saved: state.lists.saved,
})
const mapDispatchToProps = dispatch => ({
  listsActions: bindActionCreators(listsActionCreators, dispatch),
})
export class CreateFirstLastList extends Component {
  componentDidMount() {
    this.props.listsActions.fetchUserLists()
    this.setState({ ...this.props.currentProfile, saved: false, loaded: true }) // see if user had previously saved a list ( aka edit_list )
  }

  shouldShowAddSongs = () => {
    const { lists } = this.props
    if (lists && lists.length > 0) {
      const lastList = lists[lists.length - 1]
      const nonEmptySongs = lastList.filter(item => item.artistName !== '' || item.songName !== '')
      return nonEmptySongs.length === 10
    }
    return false
  }

  goNext = () => {
    //$to do: auto-save / prompt if dirty
    const { history } = this.props
    history.push('/reg/add-guardian')
  }

  saveButtonClicked = () => {
    //pass dispatch getState() ?????
    this.props.listsActions.saveUserList()
  }

  shouldShowNextButton() {
    //$to do: have to refresh page here to get the state on save
    //look for previously saved a list
    const { saved } = this.props
    if (saved && saved === true) return true

    var serverStates = this.props.user.states
    if (serverStates && serverStates.length > 0) {
      const hasList = serverStates.find(item => item === 'edit_list')
      return hasList === 'edit_list'
    }
    return false
  }

  render() {
    const { lists, loading, saving } = this.props

    return (
      <div className={styles.content}>
        <h3>STEP TWO: ADD YOUR SONGS</h3>
        <p>
          Got loads of favorite songs? No problem. You can include as many as you like – it’s only
          $1 for a set of 10 songs. And you can add more sets and change your Last List whenever the
          urge takes you. Have fun!
        </p>
        {loading ? (
          <div className={styles.loaderContainer}>
            <Loading />
          </div>
        ) : (
          <Fragment>
            <div>{lists.map((l, i) => this.renderList(l, i))}</div>
            <div className={styles.buttons}>
              {this.shouldShowAddSongs() && (
                <Button className={styles.addMoreBtn} onClick={this.props.listsActions.addNewList}>
                  Add Another 10 Songs
                </Button>
              )}

              <Button className={styles.saveBtn} onClick={this.saveButtonClicked} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>

              {this.shouldShowNextButton() && (
                <Button className={styles.nextBtn} onClick={this.goNext}>
                  Next: Nominate Guardians
                </Button>
              )}
            </div>
          </Fragment>
        )}
      </div>
    )
  }

  renderList(list, listIndex) {
    return (
      <div key={listIndex} className={styles.list}>
        {list.map((item, index) => (
          <div key={index} className={styles.listRow}>
            <Textfield
              label={index === 0 ? 'Artist Name' : null}
              placeholder="Artist Name"
              value={item.artistName}
              onChange={value => this.props.listsActions.setListItemArtist(listIndex, index, value)}
            />
            <Textfield
              label={index === 0 ? 'Song Title' : null}
              placeholder="Song Title"
              value={item.songName}
              onChange={value => this.props.listsActions.setListItemSong(listIndex, index, value)}
            />
          </div>
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(CreateFirstLastList))
