import React, { Component } from 'react'

import tree from '~core/tree'
import api from '~base/api'
import Link from '~base/router/link'
import env from '~base/env-variables'
import Page from '~base/page'
import {forcePublic} from '~base/middlewares/'

import MarbleForm from '~base/components/marble-form'

const schema = {
  'email': {
    'widget': 'EmailWidget',
    'label': 'Email',
    'required': true
  },
  'password': {
    'widget': 'PasswordWidget',
    'required': true,
    'label': 'Password'
  }
}

class LogIn extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  async submitHandler (formData) {
    const data = await api.post('/user/login', formData)

    return data
  }

  successHandler (data) {
    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()

    this.props.history.push('/app', {})
  }

  render () {
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
              <div className='columns'>
                <div className='column'>
                  <MarbleForm
                    schema={schema}
                    formData={this.state.formData}
                    onSubmit={(data) => this.submitHandler(data)}
                    onSuccess={(data) => this.successHandler(data)}
                    buttonLabel='Log in'
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

export default Page({
  path: '/log-in',
  title: 'Log in',
  exact: true,
  validate: forcePublic,
  component: LogIn
})
