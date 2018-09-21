import React, { Component } from 'react'
import api from '~base/api'
import MarbleForm from '~base/components/marble-form'

class KitForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: this.props.initialState
    }
  }

  onError (e) {
  }

  onSuccess (e) {
  }

  changeHandler (formData) {
    this.setState({
      formData
    })
  }

  clearState () {
    this.setState({
      formData: this.props.initialState
    })
  }

  async submitHandler (formData) {
    try {
      let method = formData.uuid ? 'put' : 'post'
      let data = await api[method](this.props.url, formData)
      if (this.props.load) await this.props.load()
      if (this.props.finishUp) this.props.finishUp(data)

      this.clearState()
    } catch (e) {
    }
  }

  render () {
    const { formData } = this.state

    const schema = {
      title: {
        widget: 'TextWidget',
        label: 'Título',
        required: true
      },
      description: {
        widget: 'TextWidget',
        label: 'Descripción',
        required: true
      },
      category: {
        widget: 'SelectWidget',
        label: 'Categoría',
        allowEmpty: true,
        options: [
          { label: 'Marketing', value: 'marketing' },
          { label: 'Referencia médica', value: 'medical_reference' }
        ],
        required: true
      }
    }
    const data = {
      title: formData.title,
      description: formData.description,
      category: formData.category
    }

    return (
      <div>
        <MarbleForm
          schema={schema}
          formData={data}
          onChange={data => this.changeHandler(data)}
          onSubmit={data => this.submitHandler(data)}
          onSuccess={data => this.onSuccess(data)}
          onError={data => this.onError(data)}
          handleMessages={false}
        >
          <div className='control'>
            <button className='button is-primary'>Guardar</button>
          </div>
        </MarbleForm>
      </div>
    )
  }
}

KitForm.defaultProps = {
}

export default KitForm
