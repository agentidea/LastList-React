import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import requireLogin from '../../common/hocs/requireLogin'
import * as userActionCreators from '../../common/state/user/actions'
import { profileSelector } from '../../common/state/user/selectors'

import Button from '../../common/components/Button'
import Textfield from '../../common/components/Textfield'
import styles from './EditProfile.module.css'
import DateOfBirthSelector from '../../common/components/DateOfBirthSelector'
import dateFns from 'date-fns'
import gAnalytics from '../../common/utils/googleAnalytics'

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
    gAnalytics.gAnalyticsPageView()

    this.setState({ ...this.props.currentProfile, loaded: true })
  }

  onTextChange = (field, value) => {
    this.setState({ [field]: value })
  }

  onDateChange = date => {
    if (date === null) {
      return
    }
    this.setState({ dob: new Date(date.toString()) })
  }

  saveProfile = () => {
    const { firstName, lastName, dob } = this.state
    this.setState({ saving: true })
    this.props.userActions
      .saveUserProfile(firstName, lastName, dob)
      .then(() => this.setState({ saving: false }))
      .catch(() => this.setState({ saving: false }))
  }

  render() {
    const { loaded, saving, firstName, lastName, dob } = this.state
    return (
      <div className={styles.content}>
        <h3>About You</h3>
        {loaded && (
          <Fragment>
            <Textfield
              label="First Name"
              placeholder="First Name"
              value={firstName}
              onChange={value => this.onTextChange('firstName', value)}
            />
            <Textfield
              label="Last Name"
              placeholder="Last Name"
              value={lastName}
              onChange={value => this.onTextChange('lastName', value)}
            />
            <DateOfBirthSelector
              label="Date of Birth"
              placeholder="YYYY/MM/DD"
              value={dateFns.format(dob, 'YYYY/MM/DD')}
              onChange={this.onDateChange}
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
