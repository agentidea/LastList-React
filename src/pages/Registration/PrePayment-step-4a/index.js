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
import PayPalButton from '../../../common/components/PayPalButton'
import gAnalyticsPageView from '../../../common/utils/googleAnalytics'
import * as listsActionCreators from '../../../common/state/lists/actions'
import * as paymentActionCreators from '../../../common/state/payments/actions'
import main_styles from '../../../App.module.css'
import Textfield from '../../../common/components/Textfield'

const mapStateToProps = state => ({
  guardians: state.guardians.guardians,
  invoice: state.invoice.data,
  loadingInvoice: state.invoice.loading,
  lists: state.lists.lists,
})
const mapDispatchToProps = dispatch => ({
  invoiceActions: bindActionCreators(invoiceActionCreators, dispatch),
  listsActions: bindActionCreators(listsActionCreators, dispatch),
  paymentActions: paymentActionCreators,
})

class RegPrePayment extends Component {
  state = {
    goingnext: false,
    showModal: false,
    coupon: '',
    coupon_error: null,
    verifying: false,
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
    gAnalyticsPageView()

    const { invoiceActions, listsActions } = this.props
    invoiceActions.getInvoice()
    listsActions.fetchUserLists()
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  onInputChange = (field, value) => {
    const { coupon_error } = this.state
    this.setState({
      coupon_error: value.trim() !== '' ? null : coupon_error,
      coupon: value.trim(),
    })
  }

  send_coupon = () => {
    const { coupon } = this.state
    if (coupon === '') {
      this.setState({ coupon_error: 'Can not submit an empty code!' })
      return null
    }
    this.setState({ verifying: true })
    this.props.paymentActions
      .couponVerify(coupon)
      .then(data => {
        console.log('Data returned is => ', data)
        this.setState({ coupon_error: data.code !== 200 ? data.message : null })

        if (data.code === 200) {
          window.location = '/payment-success'
        }
      })
      .catch(error => {
        console.error('could not verify coupon | ', error)
        this.setState({
          coupon_error: 'Something went wrong, could not complete coupon verification!',
        })
      })
    this.setState({ verifying: false })
  }

  render() {
    const { guardians, goingnext, invoice, loadingInvoice, user } = this.props
    const { coupon, coupon_error, verifying } = this.state

    let serverStates = user.states
    let heading =
      serverStates && serverStates.find(item => item === 'made_payment')
        ? 'Summary & Payment'
        : 'Finish up'

    return (
      <div className={main_styles.grey_bg}>
        <div className={styles.content}>
          <h3>{heading}</h3>

          <h4 className={styles.mini_header}> Your Last List</h4>
          <h4 className={styles.invoice}>
            {loadingInvoice ? <Loading /> : <Invoice invoice={invoice} />}
          </h4>

          <GuardiansList guardians={guardians} />

          {/*todo: move this to a component*/}
          {invoice.due === 0 ? null : (
            <div className={styles.coupon_wrap}>
              <Textfield
                className={styles.coupon_text}
                type="text"
                value={coupon}
                error={coupon_error}
                required
                placeholder="Coupon Code"
                onChange={value => this.onInputChange('coupon', value)}
              />
              <Button className={styles.coupon_btn} onClick={this.send_coupon} disabled={verifying}>
                {verifying ? 'Verifying...' : 'Verify code'}
              </Button>
            </div>
          )}

          <div className={styles.buttons}>
            {invoice.due === 0 ? (
              <div style={{ fontWeight: 'bold' }}>Payment already done!</div>
            ) : null}

            {invoice.due === 0 ? null : (
              <div className={styles.payButtonsWrap}>
                <Button className={styles.backBtn} onClick={this.goBack}>
                  Back
                </Button>
                <PayPalButton elements={{ amount: invoice }} />
                <Button
                  disabled={invoice.due === 0}
                  className={styles.nextBtn}
                  onClick={this.openPayment}
                >
                  {goingnext ? 'Pay via Credit Card' : 'Pay via Credit Card'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModal}
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className={styles.stripeTopHeader}>
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
