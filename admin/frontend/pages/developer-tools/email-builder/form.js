import React, { Component } from 'react'

import api from '~base/api'
import MarbleForm from '~base/components/marble-form'

const schema = {
  'name': {
    'widget': 'TextWidget',
    'name': 'name',
    'label': 'Name',
    'required': true
  },
  'title': {
    'name': 'title',
    'label': 'Title',
    'widget': 'TextareaWidget',
    'required': true
  }
}

class EmailForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formData: this.props.initialState
    }
  }

  changeHandler (formData) {
    this.setState({ formData })
  }

  async submitHandler (formData) {
    var res = await api.post(this.props.url, formData)

    if (this.props.load) { await this.props.load() }
    return res.data
  }

  successHandler (data) {
    if (this.props.finishUp) { this.props.finishUp(data) }
  }

  render () {
    return (
      <div>
        <MarbleForm
          schema={schema}
          formData={this.state.formData}
          onChange={(data) => this.changeHandler(data)}
          onSuccess={(data) => this.successHandler(data)}
          onSubmit={(data) => this.submitHandler(data)}
          buttonLabel={this.props.label || 'Save'}
        />
      </div>
    )
  }
}

export default EmailForm
