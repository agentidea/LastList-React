import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import CloseIcon from 'material-ui-icons/Close'
import Dialog, { DialogTitle, withMobileDialog } from 'material-ui/Dialog'
import { withTheme } from 'material-ui/styles'
import InfiniteCalendar from 'react-infinite-calendar'
import dateFns from 'date-fns'
import 'react-infinite-calendar/styles.css'

import Textfield from '../Textfield'
import styles from './Datepicker.module.css'

export class Datepicker extends Component {
  state = {
    pickerOpen: false,
    minDate: new Date(1900, 0, 1),
    maxDate: new Date(), // today
    pickedDate: null,
  }

  openPicker = e => {
    e.preventDefault()
    e.target.blur()
    this.setState({ pickerOpen: true })
  }

  onClose = () => {
    this.setState({ pickerOpen: false })
  }

  setDate = () => {
    this.props.onChange(this.state.pickedDate)
    this.setState({ pickerOpen: false })
  }

  onSelectDate = date => {
    this.setState({ pickedDate: date })
  }

  render() {
    const { theme } = this.props // get material-ui theme
    const primaryColor = theme.palette.primary.main
    const primaryLightColor = theme.palette.primary.light
    const primaryText = theme.palette.text.primary
    return (
      <div>
        <Textfield
          label={this.props.label}
          placeholder={this.props.placeholder}
          value={this.props.value ? dateFns.format(this.props.value, 'MM/DD/YYYY') : ''}
          onFocus={this.openPicker}
        />
        <Dialog
          open={this.state.pickerOpen}
          fullScreen={this.props.fullScreen}
          onClose={this.onClose}
          aria-labelledby="birthday-dialog-title"
        >
          <AppBar position="static">
            <Toolbar disableGutters className={styles.dialogBar}>
              <IconButton color="contrast" onClick={this.onClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <div className={styles.dialogTitle}>Select your birthday</div>
              <Button color="contrast" onClick={this.setDate}>
                Set
              </Button>
            </Toolbar>
          </AppBar>
          <InfiniteCalendar
            width={this.props.fullScreen ? '100%' : undefined} // use full-width when on mobile
            selected={this.props.value}
            min={this.state.minDate}
            minDate={this.state.minDate}
            max={this.state.maxDate}
            maxDate={this.state.maxDate}
            onSelect={this.onSelectDate}
            display="years"
            displayOptions={{
              showTodayHelper: false,
              showHeader: false,
            }}
            theme={{
              selectionColor: primaryLightColor,
              textColor: {
                default: primaryText,
                active: '#FFF',
              },
              weekdayColor: primaryLightColor,
            }}
          />
        </Dialog>
      </div>
    )
  }
}

export default withMobileDialog({ breakpoint: 'xs' })(withTheme()(Datepicker))
