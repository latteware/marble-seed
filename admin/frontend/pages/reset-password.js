import React, { Component } from 'react'

import Page from '~base/page'
import api from '~base/api'
import env from '~base/env-variables'
import {forcePublic} from '~base/middlewares/'

import MarbleForm from '~base/components/marble-form'

const schema = {
  'email': {
    'widget': 'EmailWidget',
    'label': 'Email',
    'required': true
  }
}

class ResetPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      formData: {
        email: ''
      }
    }
  }

  changeHandler ({formData}) {
    if (!this.state.bigError) {
      this.setState({formData})
    }
  }

  async submitHandler (formData) {
    formData.admin = true

    await api.post('/user/reset-password', formData)

    this.setState({
      loading: false
    })

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
                onSubmit={async (data) => { await this.submitHandler(data) }}
                onChange={(data) => { this.changeHandler(data) }}
                label='Send reset password link'
                defaultSuccessMessage='Link has been sended to your email'
                defaultErrorMessage='We cant process this request currently'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Page({
  path: '/password/forgotten',
  exact: true,
  validate: forcePublic,
  component: ResetPassword
})
