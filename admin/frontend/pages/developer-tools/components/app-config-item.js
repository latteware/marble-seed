import React, { Component } from 'react'

import ConfirmButton from '~base/components/confirm-button'

class AppConfigItem extends Component {
  constructor (props) {
    super(props)

    let value = props.appConfig.type === 'boolean' ? false : ''
    if (props.appConfig.value) {
      if (props.appConfig.type === 'object') {
        value = JSON.stringify(props.appConfig.value)
      } else {
        value = props.appConfig.value
      }
    }

    this.state = {
      currentValue: value,
      error: null,
      submitting: false
    }
  }

  componentWillReceiveProps (nextProp) {
    const { appConfig } = this.props

    if (nextProp.collapsed !== this.state.currentValue) {
      let value = appConfig.type === 'boolean' ? false : ''
      if (appConfig.value) {
        if (appConfig.type === 'object') {
          value = JSON.stringify(appConfig.value)
        } else {
          value = appConfig.value
        }
      }

      this.setState({ currentValue: value })
    }
  }

  async handleRemoveItem () {
    const { appConfig } = this.props

    this.props.removeItem(appConfig)
  }

  async handleUpdateItem (e) {
    e.preventDefault()

    const { appConfig } = this.props
    const { currentValue } = this.state
    const nextState = { submitting: false }

    this.setState({ submitting: true })

    try {
      await this.props.updateItem({
        ...appConfig,
        value: currentValue
      })
    } catch (e) {
      nextState.error = e.message
    }

    this.setState(nextState)
  }

  handleValueChange (value) {
    this.setState({
      currentValue: value,
      error: null
    })
  }

  render () {
    const { appConfig } = this.props
    const { currentValue, error, submitting } = this.state
    let previousValue = appConfig.value
    if (appConfig.type === 'object') {
      previousValue = JSON.stringify(appConfig.value)
    }

    let isButtonDisabled = false
    if (previousValue === currentValue || submitting) {
      isButtonDisabled = true
    }

    let isInputDisabled = false
    if (submitting) {
      isInputDisabled = true
    }

    let valueInput = (<input
      className='input'
      type='text'
      value={currentValue}
      disabled={isInputDisabled}
      onChange={(e) => this.handleValueChange(e.currentTarget.value)}
    />)

    if (appConfig.type === 'boolean') {
      valueInput = (<div>
        <label className='radio'>
          <input
            type='radio'
            name='boolean'
            checked={currentValue}
            value
            onChange={() => this.handleValueChange(true)}
          />
          True
        </label>
        <label className='radio'>
          <input
            type='radio'
            name='boolean'
            checked={!currentValue}
            value={false}
            onChange={() => this.handleValueChange(false)}
          />
          False
        </label>
      </div>)
    } else if (appConfig.type === 'number') {
      valueInput = (<input
        className='input'
        type='number'
        value={currentValue}
        disabled={isInputDisabled}
        onChange={(e) => this.handleValueChange(e.currentTarget.value)}
      />)
    } else if (appConfig.type === 'array') {
      valueInput = (<div>
        <input
          className='input'
          type='text'
          value={currentValue}
          disabled={isInputDisabled}
          onChange={(e) => this.handleValueChange(e.currentTarget.value)}
        />
        <span className='help'>Use comma separeted values</span>
      </div>)
    }

    return (<div className='list-item'>
      <div className='columns'>
        <div className='column is-3'>
          <b>{appConfig.key}</b><br />
          <span className='help'>{appConfig.type}</span>
        </div>
        <div className='column'>
          <form onSubmit={(e) => this.handleUpdateItem(e)}>
            <div className='field has-addons'>
              <div className='control is-fullwidth'>
                {valueInput}
                {error && <div className='help is-danger'>{error}</div>}
              </div>
              <div className='control'>
                <button
                  className='button is-primary'
                  disabled={isButtonDisabled}
                >
                  {submitting
                    ? <span>...</span>
                    : <i className='fa fa-floppy-o' />
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className='column is-1'>
          <ConfirmButton
            title='Delete config'
            className='button is-danger'
            classNameButton='button is-danger'
            onConfirm={() => this.handleRemoveItem()}
          >
            <i className='fa fa-trash-o' />
          </ConfirmButton>
        </div>
      </div>
    </div>)
  }
}

export default AppConfigItem
