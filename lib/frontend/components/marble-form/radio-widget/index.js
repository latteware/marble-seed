import React, { Component } from 'react'
import './base.scss'

class RadioWidget extends Component {
  render () {
    let {
      value,
      required,
      disabled,
      readonly,
      label,
      autofocus,
      onChange
    } = this.props

    let options = this.props.options || []
    options = options.map(option => {
      if (typeof option === 'string') {
        return { label: option, value: option }
      }
      return option
    })

    let fieldClass = 'field column'
    if (this.props.className) {
      fieldClass = fieldClass + ' ' + this.props.className
    } else {
      fieldClass = fieldClass + ' is-full'
    }

    return (
      <div className={fieldClass}>
        <label className='label' htmlFor={this.props.id}>
          {this.props.label} {this.props.required && <span className='required'>*</span>}
        </label>
        {
          options.map((item, index) => {
            return (
              <div className='radio' key={index}>
                <input
                  id={`radio${this.props.id}${index}`}
                  name={this.props.id}
                  type='radio'
                  required={required}
                  disabled={disabled || readonly}
                  autoFocus={autofocus}
                  onChange={event => onChange(item.value)}
                  checked={value ? value === item.value : false} />
                <label htmlFor={`radio${this.props.id}${index}`} className='radio-label'>
                  {options[index].label}
                </label>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default RadioWidget
