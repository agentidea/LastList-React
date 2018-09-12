import { Component } from 'react'
import { connect } from 'react-redux'
import * as userActionCreators from '../../common/state/user/actions'
import requireLogin from '../../common/hocs/requireLogin'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = dispatch => ({
  userActionCreators: bindActionCreators(userActionCreators, dispatch),
})

class SignOut extends Component {
  componentWillMount() {
    const { history, userActionCreators } = this.props
    userActionCreators.signOut().then(result => {
      history.push('/login')
    })
  }

  render() {
    return null
  }
}

export default connect(null, mapDispatchToProps)(requireLogin(SignOut))
