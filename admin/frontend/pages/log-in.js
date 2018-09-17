import React, { Component } from 'react'

import Page from '~base/page'
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

class LogIn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {
        email: '',
        password: ''
      },
      error: ''
    }
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

export default Page({
  path: '/log-in',
  exact: true,
  validate: forcePublic,
  component: LogIn
})
