import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import requireLogin from '../../../common/hocs/requireLogin'
import Loading from '../../../common/components/Loading'
import * as invoiceActionCreators from '../../../common/state/invoice/actions'

import styles from './PrePayment.module.css'
import GuardiansList from './GuardiansList'
import Invoice from './Invoice'
import Button from '../../../common/components/Button'
import ReactModal from 'react-modal'
import logo from '../../../common/components/Header/logo.png'
import StripeCardForm from './StripePayment'

const mapStateToProps = state => ({
  guardians: state.guardians.guardians,
  invoice: state.invoice.data,
  loadingInvoice: state.invoice.loading,
})
const mapDispatchToProps = dispatch => ({
  invoiceActions: bindActionCreators(invoiceActionCreators, dispatch),
})

class RegPrePayment extends Component {
  state = {
    goingnext: false,
    showModal: false,
  }

  /* handle modal open */
  handleOpenModal() {
    this.setState({ showModal: true })
  }

  /* handle modal close */
  handleCloseModal() {
    this.setState({ showModal: false })
  }

  /* action pay with card / stripe */
  openPayment = () => {
    this.handleOpenModal()
  }

  goBack = () => {
    const { history } = this.props
    history.goBack()
  }

  componentDidMount() {
    this.props.invoiceActions.getInvoice()
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  render() {
    // same as const guardians = this.props.guardians
    const { guardians, goingnext, invoice, loadingInvoice } = this.props

    return (
      <div className={styles.content}>
        <h3>STEP 4: SUMMARY</h3>

        <h4> Your Last List</h4>
        <h4>{loadingInvoice ? <Loading /> : <Invoice invoice={invoice} />}</h4>

        <GuardiansList guardians={guardians} />

        <div className={styles.buttons}>
          <Button className={styles.backBtn} onClick={this.goBack}>
            Back
          </Button>
          <Button className={styles.nextBtn} onClick={this.openPayment}>
            {goingnext ? 'Pay with Card' : 'Pay with Card'}
          </Button>
        </div>

        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModal}
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="stripeTopHeader">
            <span className="modalCloseContainer" onClick={this.handleCloseModal}>
              &times;
            </span>
            <div className="logoContainer">
              <img src={logo} alt="Last List" width="106" height="109" />
            </div>
          </div>
          <StripeCardForm elements={{ handleCloseModal: this.handleCloseModal, amount: invoice }} />
        </ReactModal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(RegPrePayment))
