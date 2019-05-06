import React, { Component } from 'react'
import MarbleForm from '~base/components/marble-form'
import api from '~base/api'

class TranslationForm extends Component {
  constructor (props) {
    super(props)

    const schema = {
      'id': {
        'label': 'id',
        'default': '',
        'id': 'id',
        'name': 'id',
        'widget': 'TextWidget',
        'required': true
      },
      'modules': {
        'widget': 'MultipleSelectWidget',
        'name': 'modules',
        'label': 'Modules',
        'required': true,
        'addable': true
      },
      'content': {
        'widget': 'TextareaWidget',
        'name': 'content',
        'label': 'Content',
        'required': true
      }
    }

    const initialState = this.props.initialState || {}

    const formData = {}
    formData.id = initialState.id || ''
    formData.modules = initialState.modules || ''
    formData.content = initialState.content || ''

    this.state = {
      formData,
      schema,
      errors: {}
    }
  }

  errorHandler (e) { }

  changeHandler (formData) {
    this.setState({
      formData
    })
  }

  async submitHandler (formData) {
    let { initialState } = this.props
    let url = this.props.url

    let modules = formData.modules.map(l => l.value)

    if (initialState) {
      url = `${this.props.url}/${initialState.uuid}`
    }
    const res = await api.post(url, { ...formData, modules: modules, lang: this.props.lang })

    if (this.props.finish) {
      await this.props.finish()
    }

    return res.data
  }

  successHandler (data) {
    if (this.props.finishUp) { this.props.finishUp(data) }
  }

  render () {
    const { schema, formData } = this.state

    schema.modules.options = this.props.modules.map(item => {
      return { label: item.name, value: item.id }
    })

    return (
      <div>
        <MarbleForm
          schema={schema}
          formData={formData}
          buttonLabel={'Save'}
          onChange={(data) => this.changeHandler(data)}
          onSuccess={(data) => this.successHandler(data)}
          onSubmit={(data) => this.submitHandler(data)}
          defaultSuccessMessage={'Translations was saved correctly'}
          errors={this.state.errors} />
      </div>)
  }
}

export default TranslationForm
