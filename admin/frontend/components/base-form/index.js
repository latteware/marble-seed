import React, { Component } from 'react'
import Form from 'react-jsonschema-form'

const PasswordWidget = (props) => {
  return (
    <input type='password'
      className='input'
      value={props.value}
      required={props.required}
      onChange={(event) => props.onChange(event.target.value)} />
  )
}

const EmailWidget = (props) => {
  return (
    <input type='email'
      className='input'
      value={props.value}
      required={props.required}
      onChange={(event) => props.onChange(event.target.value)} />
  )
}

const TextWidget = (props) => {
  return (
    <input type='text'
      className='input'
      value={props.value}
      required={props.required}
      onChange={(event) => props.onChange(event.target.value)} />
  )
}

function CustomFieldTemplate (props) {
  const { id, classNames, label, help, required, description, errors, children } = props

  if (id === 'root') {
    return (<div className={classNames}>
      {description}
      {children}
      {errors}
      {help}
    </div>)
  } else {
    return (
      <div className={classNames}>
        <label className='label' htmlFor={id}>{label}{required ? '*' : null}</label>
        <div className='control'>
          {description}
          {children}
          {errors}
          {help}
        </div>
      </div>
    )
  }
}

class BaseForm extends Component {
  render () {
    return <Form FieldTemplate={CustomFieldTemplate} {...this.props} />
  }
}

export { BaseForm, PasswordWidget, EmailWidget, TextWidget }
