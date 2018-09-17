import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import classNames from 'classnames'

const SearchFilter = (title, key, value, name, handleInputChange) => {
  return (<div className='panel-block' key={key}>
    <div className='field c-flex-1'>
      <p className='control has-icons-left is-expanded'>
        <input
          className='input is-small'
          name={name}
          type='text'
          value={value}
          onChange={handleInputChange}
          placeholder={title}
        />
        <span className='icon is-small is-left'>
          <FontAwesome name='search' />
        </span>
      </p>
    </div>
  </div>)
}

const SelectSearchFilter = (title, key, value, name, handleInputChange, values) => {
  let className

  if (!value) {
    className = 'placeholder'
  }

  return (
    <div className='panel-block' key={key}>
      <div className='field c-flex-1'>
        <p className='control has-icons-left is-expanded'>
          <select
            className={'input is-small ' + className}
            name={name}
            value={value}
            onChange={handleInputChange}
            placeholder={title}
          >
            <option hidden>{title}</option>
            {values.map(item => {
              return <option key={item.uuid} value={item.uuid}> {item.name} </option>
            })}
          </select>
          <span className='icon is-small is-left'>
            <FontAwesome name='search' />
          </span>
        </p>
      </div>
    </div>
  )
}

class BaseFilterPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      exporting: false,
      toggled: true,
      defaultFilters: this.props.filters,
      formData: this.setFormData()
    }

    this.handleResetFilters = this.handleResetFilters.bind(this)
    this.setFormData = this.setFormData.bind(this)
    this.getFilters = this.getFilters.bind(this)
    this.onToggle = this.onToggle.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  setFormData () {
    let obj = {}
    for (var item in this.props.uiSchema) {
      obj[item] = ''
    }
    return obj
  }

  handleResetFilters () {
    this.setState({
      formData: this.setFormData()
    }, () => {
      this.props.onFilter(this.state.defaultFilters || {})
    })
  }

  handleInputChange (e) {
    let formData = {...this.state.formData}
    formData[e.target.name] = e.target.value
    this.setState({ formData })
  }

  getFilters (type, title, key, value, name, handleInputChange, values) {
    let filters = ({
      SearchFilter,
      SelectSearchFilter
    })[ type ] || SearchFilter

    return filters(title, key, value, name, handleInputChange, values)
  }

  onToggle (e) {
    e.preventDefault()
    this.setState({ toggled: !this.state.toggled })
  }

  onFilter (e) {
    e.preventDefault()

    const { formData } = this.state

    let filters = {}
    for (var field in formData) {
      if (formData[field]) {
        filters[field] = formData[field]
      }
    }

    this.props.onFilter({
      ...this.state.defaultFilters,
      ...filters
    })
  }

  async onExport (e) {
    e.preventDefault()

    this.setState({ exporting: true })

    const { formData } = this.state

    let filters = {}
    for (var field in formData) {
      if (formData[field]) {
        filters[field] = formData[field]
      }
    }

    await this.props.onExport({
      ...this.state.defaultFilters,
      ...filters
    })
    this.setState({ exporting: false })
  }

  render () {
    const { schema, uiSchema } = this.props
    const { toggled } = this.state

    if (toggled) {
      return (
        <div className='searchbox'>
          <a
            className='card-header-icon has-text-white'
            aria-label='more options'
            onClick={this.onToggle}
          >
            <FontAwesome name='search' />
          </a>
        </div>
      )
    }

    let exportUI
    if (this.props.export) {
      const classNameExport = classNames('button is-primary is-fullwidth', {
        'is-loading': this.state.exporting
      })

      exportUI = <div className='panel-block'>
        <div className='columns c-flex-1'>
          <div className='column'>
            <button
              onClick={(e) => this.onExport(e)}
              className={classNameExport}
            >
              Export
            </button>
          </div>
        </div>
      </div>
    }

    return (
      <div className='column is-narrow side-filters is-paddingless'>
        <div className='card full-height is-shadowless'>
          <header className='card-header'>
            <p className='card-header-title'>
              Filtros
            </p>
            <a
              className='card-header-icon'
              aria-label='more options'
              onClick={this.onToggle}
            >
              <span className='icon'>
                <FontAwesome name='times' />
              </span>
            </a>
          </header>
          <form onSubmit={this.onFilter}>
            {Object.keys(uiSchema).map((e, i) => {
              return this.getFilters(
                uiSchema[e]['ui:widget'],
                schema.properties[e].title,
                i,
                this.state.formData[e],
                e,
                this.handleInputChange,
                schema.properties[e].values
              )
            })}

            <div className='panel-block'>
              <div className='columns c-flex-1'>
                <div className='column'>
                  <button
                    type='submit'
                    className='button is-primary is-fullwidth'
                  >
                    Filter
                  </button>
                </div>
                <div className='column'>
                  <button
                    type='button'
                    className='button is-warning is-fullwidth'
                    onClick={this.handleResetFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>
          {exportUI}
        </div>
      </div>
    )
  }
}

export default BaseFilterPanel
