import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import './style.scss'
/*
Texts

From API should look like

{
  name: 'process.json',
  type: 'json',
  mimeType: 'text/plain',
  size: '',
  content: 'URI'
}

From File reader should look like

{
  name: 'process.json',
  type: 'json',
  mimeType: 'text/plain',
  size: '',
  content: 'File content'
}

JSONs on reader

From API should look like

{
  name: 'process.json',
  type: 'json',
  mimeType: 'application/json',
  size: '',
  content: {...JSON}
}

From File reader should look like

{
  name: 'process.json',
  type: 'json',
  mimeType: 'application/json',
  size: '',
  content: {
    ...JSON
  }
}

Images and other files

From API should look like

{
  name: 'logo.jpg/*',
  type: 'image/base64',
  mimeType: '*',
  size: '',
  uri: 'http..'
}

From File reader should look like

{
  name: 'logo.jpg/*',
  type: 'image/base64',
  mimeType: '*',
  size: '',
  content: 'base64...'
}

Example marble form

const marbleSchema = {
  'imageInput': {
    'widget': 'FileWidget',
    'name': 'logo',
    'required': false,
    'hasName': true,
    'label': 'Logo',
    'type': 'image',
    'size': 1 // size is in MB default is 2 MB
  },
  'jsonInput': {
    'widget': 'FileWidget',
    'name': 'logo',
    'required': false,
    'hasName': true,
    'label': 'Logo',
    'type': 'json',
    'size': 1 // size is in MB default is 2 MB
  },
  'textInput': {
   'widget': 'FileWidget',
    'name': 'logo',
    'required': false,
    'hasName': true,
    'label': 'Logo',
    'type': 'text',
    'size': 1 // size is in MB default is 2 MB
  },
  'csvInput': {
    'widget': 'FileWidget',
    'name': 'logo',
    'required': false,
    'hasName': true,
    'label': 'Logo',
    'type': 'csv',
    'size': 1 // size is in MB default is 2 MB
  }
}
*/

class FileWidget extends Component {
  constructor (props) {
    super(props)

    let accepts
    if (props.type === 'image') {
      accepts = 'image/*'
    } else if (props.type === 'json') {
      accepts = '.json'
    } else if (props.type === 'text') {
      accepts = '.txt'
    } else if (props.type === 'csv') {
      accepts = '.csv'
    }

    this.state = {
      file: props.value,
      accepts,
      maxSize: this.props.size ? this.props.size * 1000000 : 2000000 // 2 MB
    }
  }

  componentWillReceiveProps (props) {
    let accepts = this.state.accepts
    if (props.type === 'image') {
      accepts = 'image/*'
    } else if (props.type === 'json') {
      accepts = '.json'
    } else if (props.type === 'text') {
      accepts = '.txt'
    } else if (props.type === 'csv') {
      accepts = '.csv'
    }

    this.setState({
      file: props.value,
      accepts,
      maxSize: props.size ? props.size * 1000000 : this.state.maxSize // 2 MB
    })
  }

  async onChange (e) {
    if (!e.target.files[0]) {
      return
    }

    const file = await this.processFile(e.target.files[0])

    this.setState({ file })
    this.props.onChange(file)
  }

  processFile (file) {
    if (!file) {
      return
    }
    const { name, size, type } = file

    if (size > this.state.maxSize) {
      this.setState({
        sizeError: size
      })
      return {
        content: '',
        name,
        size,
        mimeType: type,
        type: this.props.type
      }
    } else {
      this.setState({
        sizeError: undefined
      })
    }

    return new Promise((resolve, reject) => {
      const reader = new window.FileReader()
      reader.onload = event => {
        if (this.props.type === 'text') {
          resolve({
            content: event.target.result,
            name,
            size,
            mimeType: type,
            type: 'text'
          })
        } else if (this.props.type === 'csv') {
          resolve({
            content: event.target.result,
            name,
            size,
            mimeType: type,
            type: 'csv'
          })
        } else if (this.props.type === 'json') {
          let json, error
          try {
            json = JSON.parse(event.target.result)
          } catch (e) {
            error = e
          }

          if (error) {
            reject(error)
          } else {
            resolve({
              content: json,
              name,
              size,
              mimeType: type,
              type: 'json'
            })
          }
        } else if (this.props.type === 'image') {
          resolve({
            content: event.target.result,
            name,
            size,
            mimeType: type,
            type: 'image'
          })
        } else {
          resolve({
            content: event.target.result,
            name,
            size,
            mimeType: type,
            type: 'base64'
          })
        }
      }

      if (this.props.type === 'text' || this.props.type === 'json' || this.props.type === 'csv') {
        reader.readAsText(file)
      } else {
        reader.readAsDataURL(file)
      }
    })
  }

  formatBytes (bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
    for (var i = 0; i < sizes.length; i++) {
      if (bytes < 1000) {
        return bytes + ' ' + sizes[i]
      } else {
        bytes = parseFloat(bytes / 1000).toFixed(2)
      }
    }
    return bytes + ' P'
  }

  render () {
    let error

    let fieldClass = 'field column file'
    if (this.props.className) {
      fieldClass = fieldClass + ' ' + this.props.className
    } else {
      fieldClass = fieldClass + ' is-full'
    }

    let icon = 'file-text'
    if (this.props.icon) {
      icon = this.props.icon
    }

    let nameDiv = (
      <span className='file-name no-max-width'>
        <p className='file-name__name'>Select a file</p>
        <p className='file-name__size'>Max size {this.formatBytes(this.state.maxSize)}</p>
      </span>
    )

    if (this.state.file && this.state.file.name) {
      fieldClass = fieldClass + ' has-name'
      nameDiv = (
        <span className='file-name no-max-width'>
          <p className='file-name__name'>{this.state.file.name}</p>
          {this.state.file.size && this.state.file.mimeType &&
          <p className='file-name__size'>{this.formatBytes(this.state.file.size) + ' ' + this.state.file.mimeType}</p>
          }
        </span>
      )
    }

    let fileDisplay = (
      <div className='file-display has-text-centered'>
        <div>
          <p>
            <span className='icon is-large'>
              <FontAwesome name={icon} className='fa-2x' />
            </span>
          </p>
          <p className='info'>
            No file selected
          </p>
        </div>
      </div>
    )

    if (this.state.file) {
      if (this.state.file.type === 'image') {
        if (this.state.file.uri) {
          fileDisplay = (<div className='file-display has-text-centered'>
            <img src={this.state.file.uri} />
          </div>)
        } else {
          fileDisplay = (<div className='file-display has-text-centered'>
            <img src={this.state.file.content} />
          </div>)
        }
      } else if (this.state.file.type === 'json') {
        if (this.state.file.content) {
          fileDisplay = (
            <div className='file-display'>
              <pre>{JSON.stringify(this.state.file.content, null, 2).substring(0, 500)}</pre>
            </div>)
        } else {
          fileDisplay = (<div className='file-display'>
            No file selected
          </div>)
        }
      } else if (this.state.file.type === 'text' || this.state.file.type === 'csv') {
        fileDisplay = (
          <div className='file-display'>
            <pre>{this.state.file.content.substring(0, 500)}</pre>
          </div>)
      } else {
        fileDisplay = (<div className='file-display has-text-centered'>
          <div>
            <p>
              <span className='icon is-large'>
                <FontAwesome name={icon} className='fa-2x' />
              </span>
            </p>
            <p className='info'>
              {this.state.file.name}
            </p>
          </div>
        </div>)
      }
    }

    if (this.state.sizeError) {
      fileDisplay = (
        <div className='file-display has-text-centered'>
          <div>
            <p>
              <span className='icon is-large'>
                <FontAwesome name={icon} className='fa-2x has-text-danger' />
              </span>
            </p>
            <p className='info'>
              File over size limit <br />
              <span>Max size: <strong>{this.formatBytes(this.state.maxSize)}</strong></span> <br />
              <span>File: <strong>{this.formatBytes(this.state.sizeError)}</strong></span>
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className={fieldClass}>
        <label className='label' htmlFor={this.props.id}>
          {this.props.label} {this.props.required && <span className='required'>*</span>}
        </label>
        <div className='file-widget'>
          {fileDisplay}
          <label className='file-label' htmlFor={this.props.id}>
            <input
              id={this.props.id}
              type='file'
              name={this.props.id}
              accept={this.state.accepts}
              required={this.props.required}
              disabled={this.props.disabled || this.props.readonly}
              onChange={(e) => this.onChange(e)}
              style={{ visibility: 'hidden', width: 1, height: 1 }}
            />
            {nameDiv}
            <div className='file-cta'>
              <span className='file-label'>
              SELECT
              </span>
            </div>
          </label>
          {error}
        </div>
      </div>
    )
  }
}

export default FileWidget
