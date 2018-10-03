import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import requireLogin from '../../../common/hocs/requireLogin'
import * as userActionCreators from '../../../common/state/user/actions'
import { profileSelector } from '../../../common/state/user/selectors'

import UserError from '../../../common/state/user/error'
import Button from '../../../common/components/Button'
import Textfield from '../../../common/components/Textfield'
import styles from './EditProfile.module.css'
import DateOfBirthSelector from '../../../common/components/DateOfBirthSelector'
import dateFns from 'date-fns'
import gAnalyticsPageView from '../../../common/utils/googleAnalytics'

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
    saved: false,
    dobDirty: false,
    firstName: '',
    lastName: '',
    error: {
      field: null,
      message: null,
    },
  }

  componentDidMount() {
    gAnalyticsPageView()

    //
    // button next to go to create list loads disabled, but when all fields filled in and validated
    // then enable and go next ( + save )
    //

    this.setState({ ...this.props.currentProfile, loaded: true })
  }

  onTextChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  onDateChange = date => {
    if (date === null) {
      this.setState({ dob: null })
      return
    }
    this.setState({ dob: new Date(date.toString()), dobDirty: true })
  }

  goNext = () => {
    //$to do: auto-save / prompt if dirty
    const { history } = this.props
    history.push('/reg/create-list')
  }

  saveProfile = () => {
    const { firstName, lastName, dob } = this.state
    this.setState({ saving: true })
    this.props.userActions
      .saveUserProfile(firstName, lastName, dob)
      .then(() => this.setState({ saving: false, saved: true }))
      .catch(error => {
        if (error instanceof UserError) {
          const { field, message } = error
          this.setState({ error: { field, message }, saving: false, dirty: false })
        } else {
          this.setState({ error: { field: 'lastName', message: 'Unknown error' }, saving: false })
        }
      })
  }
  shouldShowSaveButton() {
    const { firstName, lastName, dobDirty, saved, dob } = this.state

    if (dob === null) return false
    if (saved !== null && saved) return false
    if (firstName === null || lastName === null) return false

    if (firstName.length > 0 && lastName.length > 0 && dobDirty) {
      return true
    } else {
      return false
    }
  }

  shouldShowNextButton() {
    if (this.state.saved === true) {
      //just saved!
      return true
    }
    //look for previously created profile state
    var serverStates = this.props.user.states
    if (serverStates && serverStates.length > 0) {
      const hasProfile = serverStates.find(item => item === 'created_profile')
      return hasProfile === 'created_profile'
    }
    return false
  }

  render() {
    const { loaded, saving, firstName, lastName, dob, error } = this.state
    const errorFirstName = error.field === 'firstName' ? error.message : null
    const errorLastName = error.field === 'lastName' ? error.message : null

    return (
      <div className={styles.content}>
        <h3>STEP 1. TELL US ABOUT YOURSELF</h3>
        {loaded && (
          <Fragment>
            <Textfield
              label="First Name"
              placeholder="First Name"
              required
              error={errorFirstName}
              value={firstName === null ? '' : firstName}
              onChange={value => this.onTextChange('firstName', value)}
            />
            <Textfield
              label="Last Name"
              placeholder="Last Name"
              required
              error={errorLastName}
              value={lastName === null ? '' : lastName}
              onChange={value => this.onTextChange('lastName', value)}
            />
            <DateOfBirthSelector
              label="Date of Birth"
              placeholder="YYYY/MM/DD"
              value={dateFns.format(dob, 'YYYY/MM/DD')}
              onChange={this.onDateChange}
            />

            <div className={styles.buttons}>
              {this.shouldShowSaveButton() && (
                <Button className={styles.saveBtn} onClick={this.saveProfile} disabled={saving}>
                  {saving ? 'Saving ...' : 'Save'}
                </Button>
              )}

              {this.shouldShowNextButton() && (
                <Button className={styles.nextBtn} onClick={this.goNext}>
                  Next: Add Songs
                </Button>
              )}
            </div>
          </Fragment>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(NewProfile))
