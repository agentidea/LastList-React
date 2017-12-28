import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loggedInSelector } from './common/state/user/selectors'
import * as userActionCreators from './common/state/user/actions'
import Background from './common/components/Background'
import Header from './common/components/Header'
import Footer from './common/components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import GuardianAccess from './pages/GuardianAccess'
import Faq from './pages/Faq'
import Four04 from './pages/Four04'
import styles from './App.module.css'

const mapStateToProps = state => ({
  isLoggedIn: loggedInSelector(state),
})
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

class App extends Component {
  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.userActions.getCurrentUser()
    }
  }

  render() {
    const { isLoggedIn } = this.props
    return (
      <Router>
        <div className={styles.app}>
          <Background />
          <div className={styles.main}>
            <Header isLoggedIn={isLoggedIn} />
            <div className={styles.content}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/guardian" component={GuardianAccess} />
                <Route path="/faq" component={Faq} />
                <Route default component={Four04} />
              </Switch>
            </div>
            <Footer />
          </div>
        </div>
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
