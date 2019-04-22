import React from 'react'
import _ from 'lodash'

import tree from '~core/tree'
import api from '~base/api'
import PageComponent from '~base/page-component'
import { loggedIn } from '~base/middlewares/'
import AppConfigItem from './components/app-config-item'

class AppConfig extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      newAppConfig: {
        type: 'string',
        key: '',
        value: ''
      },
      error: null,
      submitting: false,
      configs: []
    }
  }

  async onPageEnter () {
    const configs = await api.get('/admin/app-config', {})

    return { configs }
  }

  async updateTree () {
    const config = await api.get('/app-config')
    tree.set('config', config)

    tree.commit()
  }

  _parseValue (type, value) {
    if (type === 'boolean') {
      return value
    }

    if (!value) {
      return undefined
    }

    if (type === 'number') {
      const number = parseFloat(value)

      if (_.isNaN(number)) {
        throw new Error('Not a number')
      }

      return number
    } else if (type === 'array') {
      const array = value.split(',').map(item => item.trim())

      return array
    } else if (type === 'object') {
      const object = JSON.parse(value)

      return object
    }

    return value
  }

  handleInputChange (field, value) {
    this.setState({
      newAppConfig: {
        ...this.state.newAppConfig,
        [field]: value
      },
      error: null
    })
  }

  async handleSubmit (e) {
    const { configs, newAppConfig } = this.state
    e.preventDefault()

    this.setState({ submitting: true })

    try {
      const data = {
        ...newAppConfig,
        value: this._parseValue(newAppConfig.type, newAppConfig.value)
      }

      const body = await api.post('/admin/app-config', data)
      this.setState({
        configs: configs.concat(body),
        newAppConfig: {
          type: 'string',
          key: '',
          value: ''
        }
      })

      this.updateTree()
    } catch (e) {
      this.setState({ error: e.message })
      console.error('Error?', e)
    }

    this.setState({ submitting: false })
  }

  async handleUpdateItem (data) {
    const { configs } = this.state

    const res = await api.post(`/admin/app-config/${data.key}`, {
      value: this._parseValue(data.type, data.value)
    })

    this.setState({
      configs: configs.map(item => {
        if (item.key === data.key) {
          item.value = res.value
        }

        return item
      })
    })

    this.updateTree()
  }

  async handleRemoveItem (data) {
    const { configs } = this.state

    try {
      await api.del(`/admin/app-config/${data.key}`)
      this.setState({
        configs: configs.filter(item => item.key !== data.key)
      })
    } catch (e) {
      console.error('=>', e)
    }
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    const { newAppConfig, configs, error } = this.state

    let valueInput = (<div className='control'>
      <input className='input'
        required
        type='text'
        placeholder=''
        value={newAppConfig.value}
        onChange={(e) => this.handleInputChange('value', e.currentTarget.value)}
      />
    </div>)

    if (newAppConfig.type === 'boolean') {
      valueInput = (<div className='control'>
        <label className='radio'>
          <input
            type='radio'
            name='boolean'
            checked={newAppConfig.value}
            value
            onChange={() => this.handleInputChange('value', true)}
          />
          True
        </label>
        <label className='radio'>
          <input
            type='radio'
            name='boolean'
            checked={!newAppConfig.value}
            value={false}
            onChange={() => this.handleInputChange('value', false)}
          />
          False
        </label>
      </div>)
    } else if (newAppConfig.type === 'number') {
      valueInput = (<div className='control'>
        <input className='input'
          type='number'
          value={newAppConfig.value}
          onChange={(e) => this.handleInputChange('value', e.currentTarget.value)}
        />
      </div>)
    } else if (newAppConfig.type === 'array') {
      valueInput = (<div className='control'>
        <input className='input'
          type='text'
          value={newAppConfig.value}
          onChange={(e) => this.handleInputChange('value', e.currentTarget.value)}
        />
        <span className='help'>Use comma separated values</span>
      </div>)
    }

    const createAppConfig = (<header className='card-header'>
      <div className='card-header-title'>
        <form className='is-fullwidth' onSubmit={(e) => this.handleSubmit(e)}>
          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label'>Type</label>
            </div>
            <div className='field-body'>
              <div className='field'>
                <div className='control'>
                  <div className='select is-fullwidth'>
                    <select name='type' onChange={(e) => this.handleInputChange('type', e.currentTarget.value)} value={newAppConfig.type}>
                      <option value='boolean'>Boolean</option>
                      <option value='number'>Number</option>
                      <option value='string'>String</option>
                      <option value='array'>Array</option>
                      <option value='object'>Object</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label'>Key*</label>
            </div>
            <div className='field-body'>
              <div className='field'>
                <div className='control'>
                  <input className='input'
                    type='text'
                    placeholder='Needs to be in lower camel case'
                    value={newAppConfig.key}
                    onChange={(e) => this.handleInputChange('key', e.currentTarget.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label'>Value</label>
            </div>
            <div className='field-body'>
              <div className='field'>
                {valueInput}
              </div>
            </div>
          </div>
          <div className='field is-horizontal'>
            <div className='field-label' />
            <div className='field-body'>
              <div className='field'>
                <div className='control'>
                  {this.state.submitting ? <button disabled className='button is-primary'>
                    Submitting...
                  </button> : <button className='button is-primary'>
                    Create
                  </button>}
                  {error && <p className='help has-text-danger'>Error: {error}</p>}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </header>)

    return (<div className='columns c-flex-1 is-marginless'>
      <div className='column is-paddingless'>
        <div className='section'>
          <div className='columns'>
            {this.getBreadcrumbs()}
          </div>
          <div className='columns'>
            <div className='column'>
              <div className='card'>
                {createAppConfig}
                <div className='card-content'>
                  {configs.map(item => {
                    return <AppConfigItem
                      key={item.uuid}
                      appConfig={item}
                      removeItem={data => this.handleRemoveItem(data)}
                      updateItem={data => this.handleUpdateItem(data)}
                    />
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

AppConfig.config({
  name: 'app-config',
  path: '/app-config',
  title: 'App config',
  icon: 'bandcamp',
  breadcrumbs: [
    { label: 'Dashboard', path: '/' },
    { label: 'Developer tools' },
    { label: 'App config' }
  ],
  exact: true,
  validate: loggedIn
})

export default AppConfig
