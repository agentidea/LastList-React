import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import requireLogin from '../../../common/hocs/requireLogin'
import * as userActionCreators from '../../../common/state/user/actions'
import { profileSelector } from '../../../common/state/user/selectors'

import Button from '../../../common/components/Button'
import Textfield from '../../../common/components/Textfield'
import Datepicker from '../../../common/components/Datepicker'
import styles from './EditProfile.module.css'

const mapStateToProps = state => ({
  currentProfile: profileSelector(state),
})
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

class NewProfile extends Component {
  state = {
    loaded: false,
    saving: false,
    hasNotSaved: true,
  }

  componentDidMount() {
    //
    // button next to go to create list loads disabled, but when all fields filled in and validated
    // then enable and go next ( + save )
    //

    this.setState({ ...this.props.currentProfile, loaded: true })
  }

  onTextChange = (field, value) => {
    this.setState({ [field]: value })
  }

  onDateChange = date => {
    this.setState({ dob: date })
  }

  goNext = () => {
    //$to do: auto-save / prompt if dirty
    const { history } = this.props
    history.push('/reg/create-list')
  }

  saveProfile = () => {
    const { firstName, lastName, dob } = this.state

    //
    // validate fields filled out here ???
    //

    this.setState({ saving: true })
    this.props.userActions
      .saveUserProfile(firstName, lastName, dob)
      .then(() => this.setState({ saving: false, hasNotSaved: false }))
      .catch(() => this.setState({ saving: false }))
  }

  render() {
    const { loaded, saving, firstName, lastName, dob, hasNotSaved } = this.state

    //?? here we check if user has saved profile, if so enable next button ...
    var svd = hasNotSaved
    if (firstName !== null && lastName !== null && dob !== null) {
      svd = false
    }

    return (
      <div className={styles.content}>
        <h3>STEP 1. TELL US ABOUT YOURSELF</h3>
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
            <Datepicker
              label="Birthday"
              placeholder="Birthday"
              value={dob}
              onChange={this.onDateChange}
            />
            <div className={styles.buttons}>
              <Button className={styles.saveBtn} onClick={this.saveProfile} disabled={saving}>
                {saving ? 'Saving ...' : 'Save'}
              </Button>
              <Button className={styles.saveBtn} onClick={this.goNext} disabled={svd}>
                {saving ? 'going next ...' : 'Next: Create Your List'}
              </Button>
            </div>
          </Fragment>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(NewProfile))
