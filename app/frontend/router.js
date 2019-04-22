import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import ErrorPage from '~base/components/error-page'
import Layout from '~components/layout'

import Home from './pages/home'
import About from './pages/about'
import SignUp from './pages/sign-up'
import LogIn from './pages/log-in'
import Profile from './pages/profile'
import EmailInviteLanding from './pages/emails/invited'
import EmailResetLanding from './pages/emails/reset'
import ResetPassword from './pages/reset-password'

import App from './pages/app'

// #Import

class NotFoundPage extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return <ErrorPage message='Not found' />
  }
}

const AppRouter = () => {
  return (<Router>
    <Layout>
      <Switch>
        {Home.asRouterItem()}
        {About.asRouterItem()}
        {EmailInviteLanding.asRouterItem()}
        {EmailResetLanding.asRouterItem()}
        {ResetPassword.asRouterItem()}

        {SignUp.asRouterItem()}
        {LogIn.asRouterItem()}

        {App.asRouterItem()}
        {Profile.asRouterItem()}

        {/* Add routes here */}

        <Route component={NotFoundPage} />
      </Switch>
    </Layout>
  </Router>)
}

export default AppRouter
