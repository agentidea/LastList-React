import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Loading from '../../components/Loading'

export default ChildComponent => {
  class RequireLogin extends Component {
    render() {
      const { user, location } = this.props
      if (user.loading) {
        return <Loading />
      }
      if (!user._id) {
        return <Redirect to={`/login?fwd=${location.pathname}`} />
      }
      return <ChildComponent {...this.props} />
    }
  }

  function mapStateToProps({ user }) {
    return { user }
  }

  return withRouter(connect(mapStateToProps)(RequireLogin))
}
