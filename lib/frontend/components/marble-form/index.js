import React, { Component } from 'react'
import classNames from 'classnames'
import _ from 'lodash'

import moment from 'moment'
import Select, { Creatable } from 'react-select'
import DatePicker from 'react-datepicker'

class EmailWidget extends Component {
  render () {
    return (<div className='field'>
      <label className='label' htmlFor={this.props.id}>
        {this.props.label} {this.props.required && <span className='required'>*</span>}
      </label>
      <div className='control'>
        <input
          id={this.props.id}
          type='email'
          className='input'
          value={(this.props.value || this.props.default) || ''}
          placeholder={this.props.placeholder}
          required={this.props.required}
          disabled={this.props.disabled || this.props.readonly}
          onChange={e => this.props.onChange(e.target.value)}
        />
      </div>
    </div>)
  }
}

class TextWidget extends Component {
  render () {
    return (<div className='field'>
      <label className='label' htmlFor={this.props.id}>
        {this.props.label} {this.props.required && <span className='required'>*</span>}
      </label>
      <div className='control'>
        <input
          id={this.props.id}
          type='text'
          className='input'
          value={this.props.value !== undefined ? this.props.value : this.props.default || ''}
          placeholder={this.props.placeholder}
          required={this.props.required}
          disabled={this.props.disabled || this.props.readonly}
          onChange={e => this.props.onChange(e.target.value)}
        />
      </div>
    </div>)
  }
}

class PasswordWidget extends Component {
  render () {
    let error
    let inputClass = 'input'
    if (this.props.error) {
      error = <p className='help is-danger'>{this.props.error}</p>
      inputClass = 'input is-danger'
    }

    return (<div className='field'>
      <label className='label' htmlFor={this.props.id}>
        {this.props.label} {this.props.required && <span className='required'>*</span>}
      </label>
      <div className='control'>
        <input
          id={this.props.id}
          type='password'
          className={inputClass}
          value={this.props.value !== undefined ? this.props.value : this.props.default || ''}
          placeholder={this.props.placeholder}
          required={this.props.required}
          disabled={this.props.disabled || this.props.readonly}
          onChange={e => this.props.onChange(e.target.value)}
        />
      </div>
      {error}
    </div>)
  }
}

class HiddenWidget extends Component {
  render () {
    return (<div className='field'>
      <label className='label' htmlFor={this.props.id}>
        {this.props.label} {this.props.required && <span className='required'>*</span>}
      </label>
      <div className='control'>
        <input
          id={this.props.id}
          type='hidden'
          className='input'
          value={(this.props.value || this.props.default) || ''}
        />
      </div>
    </div>)
  }
}

class NumberWidget extends Component {
  render () {
    return (<div className='field'>
      <label className='label' htmlFor={this.props.id}>
        {this.props.label} {this.props.required && <span className='required'>*</span>}
      </label>
      <div className='control'>
        <input
          type='number'
          className='input'
          required={this.props.required}
          placeholder={this.props.placeholder}
          value={this.props.value !== undefined ? this.props.value : ''}
          step={this.props.step || ''}
          min={this.props.minimum}
          max={this.props.maximum}
          disabled={this.props.disabled || this.props.readonly}
          autoFocus={this.props.autofocus}
          onChange={e => this.props.onChange(e.target.value)}
        />
      </div>
    </div>)
  }
}

class TextareaWidget extends Component {
  render () {
    return (<div className='field'>
      <label className='label' htmlFor={this.props.id}>
        {this.props.label} {this.props.required && <span className='required'>*</span>}
      </label>
      <div className='control'>
        <textarea
          id={this.props.id}
          className='textarea'
          value={(this.props.value || this.props.default) || ''}
          placeholder={this.props.placeholder}
          required={this.props.required}
          disabled={this.props.disabled}
          readOnly={this.props.readonly}
          autoFocus={this.props.autofocus}
          rows={this.props.rows}
          onChange={e => this.props.onChange(e.target.value)}
        />
      </div>
    </div>)
  }
}

class SelectWidget extends Component {
  render () {
    let options = this.props.options || []
    options = options.map(option => {
      if (typeof option === 'string') {
        return { label: option, value: option }
      }
      return option
    })

    return (<div className='field'>
      <label className='label' htmlFor={this.props.id}>
        {this.props.label} {this.props.required && <span className='required'>*</span>}
      </label>
      <div className='control'>
        <div className='select'>
          <select
            id={this.props.id}
            value={(this.props.value || this.props.default) || ''}
            required={this.props.required}
            disabled={this.props.disabled || this.props.readonly}
            autoFocus={this.props.autofocus}
            onChange={e => this.props.onChange(e.target.value)}
          >
            {this.props.placeholder && <option value=''>{this.props.placeholder}</option>}
            {this.props.allowEmpty && <option value='' />}
            {options.map(({ value, label }) =>
              <option key={value} value={value}>{label}</option>)
            }
          </select>
        </div>
      </div>
    </div>)
  }
}

class MultipleSelectWidget extends Component {
  onChange (values) {
    this.props.onChange(values.map(item => {
      return {label: item.label, value: item.value}
    }))
  }

  render () {
    let options = this.props.options || []
    options = options.map(option => {
      if (typeof option === 'string') {
        return { label: option, value: option }
      }
      return option
    })

    let MultipleSelectComponent = Select
    if (this.props.addable) {
      MultipleSelectComponent = Creatable
    }

    return (<div className='field'>
      <label className='label' htmlFor={this.props.id}>
        {this.props.label} {this.props.required && <span className='required'>*</span>}
      </label>
      <div className='control'>
        <MultipleSelectComponent
          multi
          placeholder={this.props.placeholder}
          options={options}
          id={this.props.id}
          value={this.props.value}
          required={this.props.required}
          disabled={this.props.disabled || this.props.readonly}
          autoFocus={this.props.autofocus}
          onChange={values => this.onChange(values)}
        />
      </div>
    </div>)
  }
}

class DateWidget extends Component {
  onChange (value) {
    if (value) {
      const date = value.format()
      this.props.onChange(date)
    } else {
      this.props.onChange('')
    }
  }

  render () {
    let selected
    if (this.props.value) {
      selected = moment(this.props.value)
    }

    return (<div className='field'>
      <label className='label' htmlFor={this.props.id}>
        {this.props.label} {this.props.required && <span className='required'>*</span>}
      </label>
      <div className='control'>
        <DatePicker
          className='input'
          filterDate={this.props.filterDate}
          dateFormat={this.props.dateFormat}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          selected={selected}
          disabled={this.props.disabled}
          onChange={date => this.onChange(date)}
        />
      </div>
    </div>)
  }
}

DateWidget.defaultProps = {
  dateFormat: 'L'
}

class DateTimeWidget extends Component {
  onChange (value) {
    const date = value.format()
    this.props.onChange(date)
  }

  render () {
    let selected
    if (this.props.value) {
      selected = moment(this.props.value)
    }

    return (<div className='field'>
      <label className='label' htmlFor={this.props.id}>
        {this.props.label} {this.props.required && <span className='required'>*</span>}
      </label>
      <div className='control'>
        <DatePicker
          showTimeSelect
          className='input'
          filterDate={this.props.filterDate}
          dateFormat={this.props.dateFormat}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          selected={selected}
          disabled={this.props.disabled}
          minTime={this.props.minTime}
          maxTime={this.props.maxTime}
          onChange={date => this.onChange(date)}
        />
      </div>
    </div>)
  }
}

DateTimeWidget.defaultProps = {
  dateFormat: 'L HH:mm a'
}

class CheckboxWidget extends Component {
  render () {
    return (<div className='field'>
      <div className='control'>
        <label className='checkbox' htmlFor={this.props.id}>
          <input
            id={this.props.id}
            type='checkbox'
            checked={this.props.value !== undefined ? this.props.value : this.props.default || false}
            required={this.props.required}
            disabled={this.props.disabled || this.props.readonly}
            autoFocus={this.props.autofocus}
            onChange={event => this.props.onChange(event.target.checked)}
          /> {this.props.label} {this.props.required && <span className='required'>*</span>}
        </label>
      </div>
    </div>)
  }
}

const FormWidgets = {
  TextWidget,
  PasswordWidget,
  HiddenWidget,
  EmailWidget,
  NumberWidget,
  TextareaWidget,
  SelectWidget,
  MultipleSelectWidget,
  DateWidget,
  DateTimeWidget,
  CheckboxWidget
}

class MarbleForm extends Component {
  constructor (props) {
    super(props)

    const baseData = _.mapValues(props.schema, (item, key) => {
      const initialData = props.initialData || {}
      return initialData[key] !== undefined ? initialData[key] : item.default
    })

    this.state = {
      loading: false,

      // Schema an form data
      schema: props.schema || {},
      initialData: baseData,
      formData: props.formData || baseData || {},
      errors: props.errors || {},

      // Error handlers
      handleMessages: props.handleMessages === undefined ? true : props.handleMessages,
      defaultSuccessMessage: props.defaultSuccessMessage || 'Data correctly processed',
      defaultErrorMessage: props.defaultErrorMessage,
      successMessage: props.successMessage,
      errorMessage: props.errorMessage
    }
  }

  componentWillReceiveProps (props) {
    const schema = 'schema' in props ? props.schema : this.props.schema

    const initialData = _.mapValues(props.schema, (item, key) => {
      const initialData = props.initialData || {}

      if (initialData[key] !== undefined) {
        return initialData[key]
      } else {
        return item.default
      }
    })

    let formData = this.state.formData
    if (props.formData) {
      formData = props.formData
    } else if (props.initialData) {
      formData = initialData
    }

    const successMessage = 'successMessage' in props ? props.successMessage : this.props.successMessage
    const errorMessage = 'errorMessage' in props ? props.errorMessage : this.props.errorMessage
    const errors = props.errors || {}

    this.setState({
      schema,
      initialData,
      formData,
      errors,
      successMessage,
      errorMessage
    })
  }

  onChange ({ key, value }) {
    const formData = this.state.formData
    const config = this.state.schema[key]

    formData[key] = value

    if (config.type && config.type === 'string') {
      formData[key] = String(value)
    }

    if (config.type && config.type === 'number') {
      if (value) {
        formData[key] = Number(value)
      } else {
        formData[key] = ''
      }
    }

    if (config.type && config.type === 'boolean') {
      formData[key] = Boolean(value)
    }

    this.setState({
      formData,
      successMessage: null,
      errorMessage: null
    })

    if (this.props.onChange) {
      this.props.onChange(formData)
    }
  }

  async onSubmitHandler (e) {
    e.preventDefault()
    const {state} = this
    if (this.props.onSubmit) {
      this.setState({ loading: true })
      try {
        const res = await this.props.onSubmit(this.state.formData)

        const newState = {
          loading: false
        }

        if (state.handleMessages) {
          newState.successMessage = state.defaultSuccessMessage
          newState.errorMessage = null
        }

        this.setState(newState)
        this.onSuccess(res)
      } catch (e) {
        const newErrorMessage = {
          loading: false
        }

        if (state.handleMessages) {
          newErrorMessage.errorMessage = state.defaultErrorMessage || e.message
          newErrorMessage.successMessage = null
        }

        this.setState(newErrorMessage)
        this.onError(e)
      }
    }
  }

  onSuccess (res) {
    if (this.props.onSuccess) {
      this.props.onSuccess(res)
    }
  }

  onError (err) {
    if (this.props.onError) {
      this.props.onError(err)
    }
  }

  render () {
    let {
      errorMessage,
      successMessage,
      loading,
      formData,
      errors
    } = this.state

    const widgets = Object.keys(this.props.schema).map(key => {
      const props = this.props.schema[key]

      let FormWidget
      if (!props.widget) {
        FormWidget = TextWidget
      } else if (typeof props.widget === 'string') {
        FormWidget = FormWidgets[props.widget]
      } else {
        FormWidget = props.widget
      }

      return <FormWidget
        {...props}
        id={key}
        key={key}
        value={formData[key]}
        error={errors[key]}
        onChange={value => this.onChange({ key, value })}
      />
    })

    let formActions = this.props.children
    if (!formActions) {
      const className = classNames('button is-primary', {
        'is-loading': loading
      })

      if (_.isObject(errors) && _.isEmpty(errors)) {
        formActions = <button type='submit' className={className}>Save</button>
      } else {
        formActions = <button type='submit' disabled className={className}>Save</button>
      }
    }

    if (successMessage) {
      successMessage = <div className='content'>
        <div className='notification is-success has-text-centered'>
          {successMessage}
        </div>
      </div>
    }

    if (errorMessage) {
      errorMessage = <div className='content'>
        <div className='notification is-danger has-text-centered'>
          {errorMessage}
        </div>
      </div>
    }

    return <form className={this.props.className} onSubmit={(e) => this.onSubmitHandler(e)}>
      {widgets}
      {errorMessage}
      {successMessage}
      {formActions}
    </form>
  }
}

MarbleForm.components = FormWidgets

export default MarbleForm
