import React, { Component } from 'react'

import api from '~base/api'
import MarbleForm from '~base/components/marble-form'

const schema = {
  {% for item in fields -%}
  {{ item.name }}: {
    type: '{{ item.type }}',
    widget: '{{ item.type | toWidget }}',
    label: '{{ item.name | capitalize }}',
    {% if item.isRequired %}required: true{% endif -%}
  },
  {% endfor -%}
}

class {{ name | capitalize }}Form extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: this.props.formData
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({formData: nextProps.formData})
  }

  async submitHandler (formData) {
    const res = await api.post(this.props.url, formData)

    if (this.props.load) { await this.props.load() }
    return res.data
  }

  successHandler (data) {
    if (this.props.finishUp) { this.props.finishUp(data) }
  }

  render () {
    return (
      <div>
        <MarbleForm schema={schema}
          formData={this.state.formData}
          onSuccess={(data) => this.successHandler(data)}
          onSubmit={(data) => this.submitHandler(data)}
          buttonLabel={this.props.label || 'Save'}
          defaultSuccessMessage='{{ name | capitalize }} updated'
        />
      </div>
    )
  }
}

export default {{ name | capitalize }}Form
