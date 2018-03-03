import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import requireLogin from '../../common/hocs/requireLogin'
import * as listsActionCreators from '../../common/state/lists/actions'
import Loading from '../../common/components/Loading'
import SongInput from '../../common/components/SongInput'
import Button from '../../common/components/Button'
import styles from './EditLastList.module.css'

const mapStateToProps = state => ({
  lists: state.lists.lists,
  loading: state.lists.loading,
  saving: state.lists.saving,
})
const mapDispatchToProps = dispatch => ({
  listsActions: bindActionCreators(listsActionCreators, dispatch),
})
export class EditLastList extends Component {
  componentDidMount() {
    this.props.listsActions.fetchUserLists()
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

  render() {
    const { lists, loading, saving } = this.props
    return (
      <div className={styles.content}>
        <h3>Manage Your Last Lists</h3>
        <p>
          One of your ‘favorites’ not doing it for you anymore? You can make as many changes as you
          like and add a set of 10 songs for $1.
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
              <Button
                className={styles.saveBtn}
                onClick={this.props.listsActions.saveUserList}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
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
          <SongInput
            key={index}
            isFirst={index === 0}
            artistName={item.artistName}
            songName={item.songName}
            onBothChanged={item => this.props.listsActions.setListItem(listIndex, index, item)}
            onArtistChange={value =>
              this.props.listsActions.setListItemArtist(listIndex, index, value)
            }
            onSongChange={value => this.props.listsActions.setListItemSong(listIndex, index, value)}
          />
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(EditLastList))
