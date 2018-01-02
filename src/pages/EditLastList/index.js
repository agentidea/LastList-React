import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as listsActionCreators from '../../common/state/lists/actions'
import Loading from '../../common/components/Loading'
import requireLogin from '../../common/hocs/requireLogin'
import Textfield from '../../common/components/Textfield'
import styles from './EditLastList.module.css'

const mapStateToProps = state => ({
  lists: state.lists.lists,
  loading: state.lists.loading,
})
const mapDispatchToProps = dispatch => ({
  listsActions: bindActionCreators(listsActionCreators, dispatch),
})
export class EditLastList extends Component {
  componentDidMount() {
    this.props.listsActions.fetchUserLists()
  }

  render() {
    const { lists, loading } = this.props
    if (loading) return <Loading />
    return (
      <div>
        <h4>Step Two</h4>
        <h3>Create Your Last List</h3>
        <p>
          Get started by curating a set of 10 songs for 99&#162;. You might have loads of songs that
          you love, so your Last List can include as many sets as you like and you can edit it
          whenever you want to.
        </p>
        <div>{lists.map((l, i) => this.renderList(l, i))}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditLastList)
