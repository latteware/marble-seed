import React, { Component } from 'react'
import Page from '~base/page'

import tree from '~core/tree'
import api from '~base/api'
import Loader from '~base/components/spinner'

import {BaseForm, PasswordWidget} from '~base/components/base-form'

function validate (formData, errors) {
  if (formData.password_1 !== formData.password_2) {
    errors.password_2.addError("Passwords don't match!")
  }
  return errors
}

const schema = {
  type: 'object',
  required: ['password_1', 'password_2'],
  properties: {
    password_1: {type: 'string', title: 'Password'},
    password_2: {type: 'string', title: 'Confirm Password'}
  }
}

const uiSchema = {
  password_2: {'ui:widget': PasswordWidget},
  password_1: {'ui:widget': PasswordWidget}
}

class EmailResetLanding extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      formData: {
        password_1: '',
        password_2: ''
      },
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden',
      user: {}
    }
  }

  componentWillMount () {
    this.verifyToken()
  }

  errorHandler (e) {}

  changeHandler ({formData}) {
    if (!this.state.bigError) {
      this.setState({
        formData,
        apiCallMessage: 'is-hidden',
        apiCallErrorMessage: 'is-hidden',
        error: ''
      })
    }
  }

  clearState () {
    this.setState({
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden',
      formData: this.props.initialState
    })
  }

  async verifyToken () {
    var search = decodeURIComponent(this.props.location.search)
      .substring(1)
      .split('&')
    let tokenData = {}

    for (var param of search) {
      var spl = param.split('=')
      tokenData[spl[0]] = spl[1]
    }

    var data
    try {
      data = await api.post('/emails/reset/validate', tokenData)
    } catch (e) {
      return this.setState({
        ...this.state,
        error: e.message,
        bigError: true,
        apiCallErrorMessage: 'message is-danger'
      })
    }

    this.setState({
      ...this.state,
      token: tokenData.token,
      user: data.user
    })
  }

  async submitHandler ({formData}) {
    formData.uuid = this.state.token
    formData.password = formData.password_1

    var data
    try {
      data = await api.post('/user/set-password', formData)
    } catch (e) {
      return this.setState({
        error: e.message,
        apiCallErrorMessage: 'message is-danger'
      })
    }

    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()

    this.setState({...this.state, apiCallMessage: 'message is-success'})

    setTimeout(() => {
      this.props.history.push('/app', {})
    }, 4000)
  }

  render () {
    let spinner

    if (this.state.loading) {
      spinner = <Loader />
    }

    var error
    if (this.state.error) {
      error = <div>
        Error: {this.state.error}
      </div>
    }

    return (
      <div className='Reset single-form'>
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Hi {this.state.user.screenName}!
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
                Don't worry, you can create a new password here.
              </p>
              <BaseForm schema={schema}
                uiSchema={uiSchema}
                formData={this.state.formData}
                onSubmit={(e) => { this.submitHandler(e) }}
                onError={(e) => { this.errorHandler(e) }}
                onChange={(e) => { this.changeHandler(e) }}
                validate={validate}
                showErrorList={false}
              >
                { spinner }
                <div className={this.state.apiCallMessage}>
                  <div className='message-body is-size-7 has-text-centered'>
                    Password created successfully! We'll redirect you to the
                    app in a sec.
                  </div>
                </div>
                <div className={this.state.apiCallErrorMessage}>
                  <div className='message-body is-size-7 has-text-centered'>
                    {error}
                  </div>
                </div>
                <button
                  className='button is-primary is-fullwidth'
                  type='submit'
                  disabled={!!error || this.state.bigError}
                  >
                    Reset password
                  </button>
              </BaseForm>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Page({
  path: '/emails/reset',
  title: 'Email reset',
  exact: true,
  component: EmailResetLanding
})
