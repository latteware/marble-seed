import React, { Component } from 'react'
import api from '~base/api'
import tree from '~core/tree'

import MarbleForm from '~base/components/marble-form'

class UpdateProfileForm extends Component {
  constructor (props) {
    super(props)

    let email
    let screenName
    let lang

    if (tree.get('user')) {
      screenName = tree.get('user').screenName
      email = tree.get('user').email
      lang = tree.get('user').lang
    }

    this.state = {
      formData: {
        email,
        screenName,
        lang
      }
    }
  }

  changeHandler (formData) {
    this.setState({ formData })
  }

  async submitHandler (formData) {
    const data = await api.post('/user/me/update', formData)

    tree.set('user', data.user)
    tree.commit()
    this.languageSettingDispatcher(data.user.lang)
  }

  languageSettingDispatcher (lang) {
    window.dispatchEvent(
      new CustomEvent('lang', {
        detail: { lang }
      })
    )
  }

  render () {
    const schema = {
      screenName: {
        widget: 'TextWidget',
        label: this.props.intl.formatMessage({ id: `general.name` }),
        required: true
      },
      email: {
        widget: 'EmailWidget',
        label: this.props.intl.formatMessage({ id: `general.email` }),
        required: true
      },
      lang: {
        widget: 'SelectWidget',
        label: this.props.intl.formatMessage({ id: `general.lang` }),
        required: true,
        allowEmpty: false,
        options: [
          { label: 'es-MX', value: 'es-MX' },
          { label: 'en-US', value: 'en-US' }
        ]
      }
    }

    return (
      <div className='is-fullwidth'>
        <MarbleForm
          schema={schema}
          formData={this.state.formData}
          onChange={(data) => this.changeHandler(data)}
          onSubmit={(data) => this.submitHandler(data)}
          defaultSuccessMessage='Your profile was updated correctly'
          buttonLabel='Update'
        />
      </div>
    )
  }
}

export default UpdateProfileForm
