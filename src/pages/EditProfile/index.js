import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import requireLogin from '../../common/hocs/requireLogin'
import * as userActionCreators from '../../common/state/user/actions'
import { profileSelector } from '../../common/state/user/selectors'

import Button from '../../common/components/Button'
import Textfield from '../../common/components/Textfield'
import styles from './EditProfile.module.css'

const mapStateToProps = state => ({
  currentProfile: profileSelector(state),
})
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

class EditProfile extends Component {
  state = {
    loaded: false,
    saving: false,
  }

  componentDidMount() {
    this.setState({ ...this.props.currentProfile, loaded: true })
    console.log(this.props.currentProfile)
  }

  onTextChange = (field, value) => {
    this.setState({ [field]: value })
  }

  saveProfile = () => {
    const { firstName, lastName } = this.state
    this.setState({ saving: true })
    this.props.userActions
      .saveUserProfile(firstName, lastName)
      .then(() => this.setState({ saving: false }))
  }

  render() {
    const { loaded, saving, firstName, lastName } = this.state
    return (
      <div className={styles.content}>
        <h4>Step One</h4>
        <h3>About You</h3>
        {loaded && (
          <Fragment>
            <Textfield
              label="First name"
              placeholder="First name"
              value={firstName}
              onChange={value => this.onTextChange('firstName', value)}
            />
            <Textfield
              label="Last name"
              placeholder="Last name"
              value={lastName}
              onChange={value => this.onTextChange('lastName', value)}
            />
            <Button className={styles.saveBtn} onClick={this.saveProfile} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Fragment>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(EditProfile))
