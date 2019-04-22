import React from 'react'

import PageComponent from '~base/page-component'
import api from '~base/api'
import env from '~base/env-variables'
import { forcePublic } from '~base/middlewares/'

import MarbleForm from '~base/components/marble-form'

const schema = {
  'email': {
    'widget': 'EmailWidget',
    'label': 'Email',
    'required': true
  }
}

class ResetPassword extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...this.baseState,
      formData: {}
    }
  }

  async submitHandler (formData) {
    formData.admin = true

    await api.post('/user/reset-password', formData)
  }

  successHandler () {
    setTimeout(() => {
      this.props.history.push(env.PREFIX + '/log-in', {})
    }, 5000)
  }

  render () {
    return (
      <div className='LogIn single-form'>
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Reset Password
            </p>
            <a className='card-header-icon'>
              <span className='icon'>
                <i className='fa fa-angle-down' />
              </span>
            </a>
          </header>
          <div className='card-content'>
            <div className='content'>
              <p>
                We need your email address for us to send you a password reset
                link:
              </p>
              <MarbleForm
                schema={schema}
                formData={this.state.formData}
                onSubmit={(data) => this.submitHandler(data)}
                onSuccess={(data) => this.successHandler(data)}
                label='Send reset password link'
                defaultSuccessMessage='Link has been sended to your email'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ResetPassword.config({
  path: '/password/forgotten',
  exact: true,
  validate: forcePublic,
  component: ResetPassword
})

export default ResetPassword
