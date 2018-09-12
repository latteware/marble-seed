import React, { Component } from 'react'
import api from '~base/api'
import BaseModal from '~base/components/base-modal'
import MarbleForm from '~base/components/marble-form'
import BaseDeleteButton from '~base/components/base-deleteButton'

const schema = {
  name: {
    widget: 'TextWidget',
    label: 'Name',
    required: true
  }
}

class TokensList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tokens: [],
      error: '',
      modalClassName: '',
      notificationClass: 'is-hidden'
    }
  }

  componentWillMount () {
    this.getTokens()
  }

  async getTokens () {
    let data
    try {
      data = await api.get('/user/tokens')
    } catch (e) {
      return this.setState({
        error: e.message
      })
    }

    this.setState({
      tokens: data.tokens
    })
  }

  async removeToken (item) {
    try {
      await api.del('/user/tokens/' + item.uuid)
      let index = this.state.tokens.indexOf(item)
      let aux = this.state.tokens
      aux.splice(index, 1)
      this.setState({
        tokens: aux
      })
    } catch (e) {
      return this.setState({
        error: e.message
      })
    }
  }

  async createToken (item) {
    let data
    try {
      data = await api.post('/user/tokens', item)
      this.setState({
        tokens: this.state.tokens.concat(data.token),
        notificationClass: ''
      })

      this.setState({formData: {}})
      setTimeout(() => {
        this.hideModal()
      }, 500)
    } catch (e) {
      return this.setState({
        ...this.state,
        error: e.message
      })
    }
  }

  showModal () {
    this.setState({
      modalClassName: ' is-active'
    })
  }

  hideModal () {
    this.setState({
      modalClassName: ''
    })
  }

  changeHandler (formData) {
    this.setState(formData)
  }

  showNotification () {
    this.setState({
      notificationClass: ''
    })
  }

  hideNotification () {
    this.setState({
      notificationClass: 'is-hidden'
    })
  }

  render () {
    return (
      <div className='panel is-bg-white'>
        <p className='panel-heading'>
          Api Tokens
          <a className='button is-primary is-pulled-right is-small' onClick={() => this.showModal()}>New Token</a>
        </p>

        <div className='panel-block'>
          <div className='panel-body is-fullwidth'>
            <div className={'notification is-primary  ' + this.state.notificationClass} style={{marginBottom: '15px !important'}}>
              <button className='delete' onClick={() => this.hideNotification()} />
              Please save your secret on a safe place
            </div>

            {this.state.tokens.map((item, index) => (
              <div className='token is-relative' key={index} style={{borderBottom: '1px solid lightGrey', marginBottom: 10, paddingBottom: 5}}>
                <p style={{fontSize: '1.4em', marginBottom: 10}}><strong>{item.name}</strong></p>
                {item.secret ? <p className='secret' style={{marginBottom: 5}}><strong>Secret:</strong> {item.secret} </p> : null}
                <p style={{marginBottom: 5}}><strong>Key:</strong> {item.key} </p>
                <p style={{marginBottom: 5}}><strong>Last Use:</strong> {item.lastUse ? item.lastUse : 'N/A'}</p>
                <div className='is-bottom'>
                  <BaseDeleteButton
                    objectDelete={() => { this.removeToken(item) }}
                    titleButton='Revoke'
                    objectName={item.name}
                    message='Remove user token?'
                    history={this.props.history}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <BaseModal
          title='Create Token'
          className={this.state.modalClassName}
          hideModal={() => this.hideModal()}
        >
          <MarbleForm
            schema={schema}
            formData={this.state.formData}
            onChange={(data) => this.changeHandler(data)}
            onSubmit={(data) => this.createToken(data)}
            buttonLabel='Create token'
            defaultSuccessMessage='Token created'
          />
        </BaseModal>
      </div>
    )
  }
}

export default TokensList
