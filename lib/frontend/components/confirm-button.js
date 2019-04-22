import React, { Component } from 'react'
import BaseModal from '~base/components/base-modal'
import classNames from 'classnames'

class ConfirmButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false,
      processing: false,
      error: ''
    }
  }

  showModal () {
    this.setState({ active: true })
  }

  hideModal () {
    this.setState({
      active: false,
      processing: false,
      error: ''
    })
  }

  async onConfirm () {
    this.setState({ processing: true })

    let data, error
    if (this.props.onConfirm) {
      try {
        data = await this.props.onConfirm()
      } catch (e) {
        error = e
        this.onError(e)
      }
    }

    this.setState({ processing: false })

    if (!error) {
      this.onSuccess(data)
    }
  }

  onSuccess (data) {
    this.hideModal()
    if (this.props.onSuccess) { this.props.onSuccess(data) }
  }

  onError (e) {
    this.setState({ error: e.message })
  }

  render () {
    const { processing, active, error } = this.state

    const className = classNames('is-confirm-modal', this.props.classNameModal, {
      'is-active': active
    })

    const buttonWidth = { minWidth: 135 }
    let confirmButton = <button className={this.props.classNameButton} onClick={() => this.onConfirm()} style={buttonWidth}>Accept</button>
    if (processing) {
      confirmButton = <button className={'is-disabled ' + this.props.classNameButton} style={buttonWidth}>Processing...</button>
    }

    const buttons = <div style={{ margin: '0 auto' }}>
      {confirmButton}
      <button className='button' onClick={() => this.hideModal()} style={buttonWidth}>Cancel</button>
    </div>

    let errorEl
    if (error) {
      errorEl = <div className='content column is-full'>
        <div className='notification is-danger has-text-centered'>
          {error}
        </div>
      </div>
    }

    return <div>
      <BaseModal
        className={className}
        title={this.props.title}
        footer={buttons}
        hideModal={() => this.hideModal()}
        hasFooter
      >
        <div>
          <h2 className='subtitle has-text-centered'>{this.props.message}</h2>
          {errorEl}
        </div>
      </BaseModal>

      <a
        className={this.props.className}
        onClick={() => this.showModal()}
      >
        {this.props.children}
      </a>
    </div>
  }
}

ConfirmButton.defaultProps = {
  title: 'Confirm',
  message: 'Are you sure to do this?',
  classNameModal: '',
  classNameButton: 'button is-primary'
}

export default ConfirmButton
