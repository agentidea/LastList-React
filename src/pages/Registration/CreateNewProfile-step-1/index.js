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
    current_state: 'create',
  }

  componentDidMount() {
    gAnalyticsPageView()

    //
    // button next to go to create list loads disabled, but when all fields filled in and validated
    // then enable and go next ( + save )
    //

    this.setState({ ...this.props.currentProfile, loaded: true })
    this.checkCurrentState()
  }

  onTextChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  onDateChange = date => {
    if (date === null) {
      this.setState({ dob: this.props.currentProfile.dob })
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
    const { firstName, lastName, dob, current_state } = this.state
    this.setState({ saving: true })
    this.props.userActions
      .saveUserProfile(firstName, lastName, dob)
      .then(() => {
        this.setState({ saving: false, saved: true })
        if (current_state === 'update') {
          window.location.reload()
        }
      })
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

    return firstName.length > 0 && lastName.length > 0
  }

  shouldShowNextButton() {
    if (this.state.saved === true) {
      //just saved!
      return true
    }
    //look for previously created profile state
    let serverStates = this.props.user.states
    if (serverStates && serverStates.length > 0) {
      const hasProfile = serverStates.find(item => item === 'created_profile')
      return hasProfile === 'created_profile'
    }
    return false
  }

  checkCurrentState = () => {
    let serverStates = this.props.user.states
    if (serverStates && serverStates.find(item => item === 'registration_complete')) {
      this.setState({ current_state: 'update' })
    }
  }

  render() {
    const { loaded, saving, firstName, lastName, dob, error } = this.state
    const errorFirstName = error.field === 'firstName' ? error.message : null
    const errorLastName = error.field === 'lastName' ? error.message : null

    let serverStates = this.props.user.states
    let heading = 'STEP 1. TELL US ABOUT YOURSELF'
    let actionBtnText = 'Save'

    if (serverStates && serverStates.find(item => item === 'registration_complete')) {
      heading = 'ABOUT YOU'
      actionBtnText = 'Update'
    }

    return (
      <div className={styles.content}>
        <h3>{heading}</h3>
        <p className={styles.para}>To make changes to your profile, simply edit the info below</p>
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
              onChange={value => this.onDateChange(value)}
            />

            <div className={styles.buttons}>
              {this.shouldShowNextButton() && (
                <Button className={styles.nextBtn} onClick={this.goNext}>
                  Next: Your Last List
                </Button>
              )}

              {this.shouldShowSaveButton() && (
                <Button className={styles.saveBtn} onClick={this.saveProfile} disabled={saving}>
                  {saving ? 'Please wait...' : actionBtnText}
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
