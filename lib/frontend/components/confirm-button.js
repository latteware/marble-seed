import React, { Component } from 'react'
import BaseModal from '~base/components/base-modal'
import classNames from 'classnames'

class ConfirmButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }

  showModal () {
    this.setState({ active: true })
  }

  hideModal () {
    this.setState({ active: false })
  }

  onConfirm () {
    if (this.props.onConfirm) this.props.onConfirm()
    this.hideModal()
  }

  render () {
    const className = classNames('is-confirm-modal', this.props.classNameModal, {
      'is-active': this.state.active
    })

    const buttons = <div style={{ margin: '0 auto' }}>
      <button className={this.props.classNameButton} onClick={() => this.onConfirm()}>Accept</button>
      <button className='button' onClick={() => this.hideModal()}>Cancel</button>
    </div>

    return <div>
      <BaseModal
        className={className}
        title={this.props.title}
        footer={buttons}
        hideModal={() => this.hideModal()}
        hasFooter
      >
        <div className='section'>
          <h2 className='subtitle has-text-centered'>{this.props.message}</h2>
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
