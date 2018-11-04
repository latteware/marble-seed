import React from 'react'

import PageComponent from '~base/page-component'
import api from '~base/api'
import env from '~base/env-variables'
import tree from '~core/tree'
import Link from '~base/router/link'
import {forcePublic} from '~base/middlewares/'

import MarbleForm from '~base/components/marble-form'

const schema = {
  'email': {
    'widget': 'EmailWidget',
    'name': 'email',
    'label': 'Email',
    'required': true
  },
  'password': {
    'widget': 'PasswordWidget',
    'name': 'password',
    'required': true,
    'label': 'Password'
  }
}

class LogIn extends PageComponent {
  constructor (props) {
    super(props)

    const expiredSession = tree.get('expiredSession')
    tree.set('expiredSession', false)
    tree.commit()

    this.state = {
      ...this.baseState,
      formData: {},
      expiredSession
    }
  }

  removeExpiredSession () {
    this.setState({expiredSession: false})
  }

  async submitHandler (formData) {
    const data = await api.post('/user/login', formData)

    if (!data.isAdmin) {
      throw new Error('Invalid user')
    }

    return data
  }

  succesHandler (data) {
    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()

    this.props.history.push(env.PREFIX + '/', {})
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    var resetLink
    if (env.EMAIL_SEND) {
      resetLink = (
        <p>
          <Link to='/password/forgotten/'>
            Forgot password?
          </Link>
        </p>
      )
    }

    let expiredSession
    if (this.state.expiredSession) {
      expiredSession = <div className='columns'>
        <div className='column'>
          <div className='notification is-warning'>
            <button className='delete' onClick={() => this.removeExpiredSession()} />
            Session expired
          </div>
        </div>
      </div>
    }

    return (
      <div className='LogIn single-form'>
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Log in
            </p>
            <a className='card-header-icon'>
              <span className='icon'>
                <i className='fa fa-angle-down' />
              </span>
            </a>
          </header>
          <div className='card-content'>
            <div className='content'>
              {expiredSession}
              <div className='columns'>
                <div className='column'>
                  <MarbleForm
                    schema={schema}
                    formData={this.state.formData}
                    onSubmit={(data) => this.submitHandler(data)}
                    onSuccess={(data) => this.succesHandler(data)}
                    label='Log in'
                  />
                </div>
              </div>
              {resetLink}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

LogIn.config({
  path: '/log-in',
  exact: true,
  validate: forcePublic,
  component: LogIn
})

export default LogIn
