import React from 'react'

import PageComponent from '~base/page-component'
import tree from '~core/tree'
import api from '~base/api'
import {forcePublic} from '~base/middlewares/'

import MarbleForm from '~base/components/marble-form'

const schema = {
  'password_1': {
    'widget': 'PasswordWidget',
    'name': 'password',
    'required': true,
    'label': 'Password'
  },
  'password_2': {
    'widget': 'PasswordWidget',
    'name': 'password',
    'required': true,
    'label': 'Confirm Password'
  }
}

class EmailResetLanding extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      formData: {},
      user: {}
    }
  }

  async onPageEnter () {
    const data = await this.verifyToken()

    return data
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

    return {
      token: tokenData.token,
      user: data.user
    }
  }

  changeHandler (formData) {
    if (formData.password_2 && formData.password_1 !== formData.password_2) {
      this.setState({
        errors: {
          password_2: 'Passwords don\'t match'
        }
      })
    } else {
      this.setState({
        errors: {}
      })
    }
  }

  async submitHandler (formData) {
    const postData = {
      uuid: this.state.token,
      password: formData.password_1
    }

    const data = await api.post('/user/set-password', postData)

    return data
  }

  successHandler (data) {
    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    const {errors, user} = this.state

    let contentEl
    if (user && !user.isAdmin) {
      contentEl = (<div className='card'>
        <header className='card-header'>
          <p className='card-header-title'>
            Hi {this.state.user.screenName}!
          </p>
        </header>
        <div className='card-content'>
          <div className='content'>
            <p>
              You are not an admin. Please go back to the app
            </p>
          </div>
        </div>
      </div>)
    } else {
      contentEl = (<div className='card'>
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
            <MarbleForm
              schema={schema}
              formData={this.state.formData}
              errors={errors}
              onSubmit={(data) => this.submitHandler(data)}
              onSuccess={(data) => this.successHandler(data)}
              onChange={(data) => this.changeHandler(data)}
              defaultSuccessMessage={'User was updated correctly'}
            />
          </div>
        </div>
      </div>)
    }

    return (
      <div className='Reset single-form'>
        {contentEl}
      </div>
    )
  }
}

EmailResetLanding.config({
  path: '/emails/reset',
  exact: true,
  validate: forcePublic,
  component: EmailResetLanding
})

export default EmailResetLanding
