import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BaseModal from '~base/components/base-modal'

class DeleteButton extends Component {
  constructor (props) {
    super(props)
    this.hideModal = this.hideModal.bind(this)
    this.yesOnClick = this.yesOnClick.bind(this)
    this.state = {
      className: ''
    }
  }

  showModal () {
    this.setState({
      className: ' is-active'
    })
  }

  hideModal () {
    this.setState({
      className: ''
    })
  }

  async yesOnClick () {
    await this.props.objectDelete()
    this.hideModal()
  }

  render () {
    let footer = (
      <div>
        <button
          className='button is-danger'
          type='button'
          onClick={this.yesOnClick}
        >
          {this.props.titleButton || 'Eliminar'}
        </button>
        <button className='button' onClick={this.hideModal}>Cancel</button>
      </div>
    )

    return (
      <div>
        <button
          className='button is-danger'
          type='button'
          onClick={() => this.showModal()}
        >
          {this.props.children || this.props.titleButton || 'Eliminar'}
        </button>
        <BaseModal
          title={(this.props.titleButton || 'Eliminar') + ' ' + (this.props.objectName || 'Objeto')}
          className={this.state.className}
          hideModal={this.hideModal}
          hasFooter
          footer={footer}
        >
          <h3>
            {this.props.message || 'Estas seguro de querer eliminar este objeto?'}
          </h3>
        </BaseModal>
      </div>
    )
  }
}

DeleteButton.proptypes = {
  objectDelete: PropTypes.func.isRequired,
  titleButton: PropTypes.string,
  objectName: PropTypes.string,
  message: PropTypes.string,
  history: PropTypes.object.isRequired
}

export default DeleteButton
