import React, { Component } from 'react'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import Tooltip from 'material-ui/Tooltip'
import Slide from 'material-ui/transitions/Slide'

import Button from '../../../../common/components/Button'
import styles from './GuardiansList.module.css'
import gAnalyticsPageView from '../../../../common/utils/googleAnalytics'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

const Transition = props => <Slide direction="down" {...props} /> // used for the remove dialog

export default class GuardiansList extends Component {
  state = {
    guardianToRemove: null,
  }

  componentDidMount() {
    gAnalyticsPageView()
  }

  render() {
    const { guardians } = this.props
    return (
      <div className={styles.listWrap}>
        <h4>Current Guardians</h4>

        <ul>
          {guardians.map(g => (
            <li key={g.uuid}>
              {g.firstName} {g.lastName} ({g.email})
              <Tooltip id="tooltip-top" title="Remove" placement="right">
                <span className={styles.deleteIcon} onClick={() => this.removeGuardian(g)}>
                  <FontAwesomeIcon className={styles.faIcon} icon={faTrashAlt} />
                </span>
              </Tooltip>
            </li>
          ))}
          {this.renderRemoveDialog()}
        </ul>
      </div>
    )
  }

  removeGuardian = guardian => {
    this.setState({ guardianToRemove: guardian })
  }

  doRemoveGuardian = async () => {
    const { guardianToRemove } = this.state
    const { onRemoveGuardian } = this.props
    if (guardianToRemove && onRemoveGuardian) {
      onRemoveGuardian(guardianToRemove.uuid)
    }
    this.closeRemoveDialog()
  }

  closeRemoveDialog = () => {
    this.setState({ guardianToRemove: null })
  }

  renderRemoveDialog() {
    const { guardianToRemove } = this.state
    return (
      <Dialog
        open={!!guardianToRemove}
        transition={Transition}
        onClose={this.closeRemoveDialog}
        aria-labelledby="remove-dialog-title"
        aria-describedby="remove-dialog-description"
      >
        <DialogTitle id="remove-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-dialog-description">
            You will remove{' '}
            <b>
              {guardianToRemove && `${guardianToRemove.firstName} ${guardianToRemove.lastName}`}
            </b>{' '}
            from your guardians.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeRemoveDialog} nonprimary>
            Cancel
          </Button>
          <Button onClick={this.doRemoveGuardian}>Remove</Button>
        </DialogActions>
      </Dialog>
    )
  }
}
