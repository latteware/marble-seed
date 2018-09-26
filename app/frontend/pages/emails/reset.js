import React from 'react'
import PageComponent from '~base/page-component'

import tree from '~core/tree'
import api from '~base/api'

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
      errors: {},
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

    setTimeout(() => {
      this.props.history.push('/app', {})
    }, 2000)
  }

  render () {
    const {errors} = this.state

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
              <MarbleForm
                schema={schema}
                formData={this.state.formData}
                errors={errors}
                onSubmit={(data) => this.submitHandler(data)}
                onChange={(data) => this.changeHandler(data)}
                onSuccess={(data) => this.successHandler(data)}
                defaultSuccessMessage={'Password added, redirecting to the app'}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EmailResetLanding.config({
  path: '/emails/reset',
  title: 'Email reset',
  exact: true,
  component: EmailResetLanding
})

export default EmailResetLanding
