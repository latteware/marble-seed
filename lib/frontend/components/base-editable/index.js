import React, { Component } from 'react'

class Editable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      edit: this.props.edit || false,
      value: this.props.value || '',
      width: this.props.width || 100,
      className: this.props.className,
      original: this.props.value || ''
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        edit: nextProps.edit,
        value: nextProps.value,
        width: nextProps.width,
        className: nextProps.className,
        original: nextProps.value
      })
    }
  }

  hideInput () {
    this.setState({
      edit: false,
      value: this.state.original
    })
  }

  showInput () {
    this.setState({
      edit: true
    })
  }

  async onEnter (e) {
    let value = e.target.value

    if (e.charCode === 13) {
      if (this.props.type === 'number') {
        value = Number(value.replace(/[^(\-|+)?][^0-9.]/g, ''))
      }

      this.hideInput()
      const res = await this.props.handleChange(value, this.props.obj || {})

      if (res) {
        this.setState({
          value: value,
          original: value
        })
      }
    }
  }

  onChange (e) {
    this.setState({ value: e.target.value })
  }

  render () {
    return (
      <div>
        {this.state.edit ? <input
          type={this.props.type || 'text'}
          className='input'
          value={this.state.value}
          onBlur={() => this.hideInput()}
          onKeyPress={(e) => this.onEnter(e)}
          onChange={(e) => this.onChange(e)}
          style={{ width: this.state.width }}
          autoFocus
        />
          : <div>
            <span> {this.state.value} </span>
            <span className='icon is-large is-clickable' onClick={() => this.showInput()} title='Edit'>
              <i className='fa fa-edit fa-lg' />
            </span>
          </div>}
      </div>
    )
  }
}

export default Editable
