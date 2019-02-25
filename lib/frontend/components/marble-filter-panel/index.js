import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import classNames from 'classnames'

import MarbleForm from '~base/components/marble-form'

class MarbleFilterPanel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      exporting: false,
      isOpen: true,
      defaultFilters: this.props.filters,
      formData: {}
    }
  }

  open () {
    this.setState({ isOpen: true })
  }

  close () {
    this.setState({ isOpen: false })
  }

  changeHandler (formData) {
    this.setState({
      errorMessage: null,
      formData
    })
  }

  async submitHandler () {
    const { formData } = this.state

    let filters = {}
    for (var field in formData) {
      if (formData[field]) {
        filters[field] = formData[field]
      }
    }

    try {
      await this.props.onFilter({
        ...this.state.defaultFilters,
        ...filters
      })
    } catch (e) {
      this.setState({
        errorMessage: e.message
      })
    }
  }

  resetHandler () {
    this.setState({ formData: {} })
  }

  async exportHandler () {
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
    const { isOpen } = this.state

    if (!isOpen) {
      return (
        <div className='searchbox'>
          <a
            className='card-header-icon has-text-white'
            aria-label='more options'
            onClick={() => this.open()}
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
              onClick={() => this.exportHandler()}
              className={classNameExport}
            >
              Export
            </button>
          </div>
        </div>
      </div>
    }

    return <div className='column is-narrow side-filters is-paddingless'>
      <div className='card full-height is-shadowless'>
        <header className='card-header'>
          <p className='card-header-title'>
            Filtros
          </p>
          <a
            className='card-header-icon'
            aria-label='more options'
            onClick={() => this.close()}
          >
            <span className='icon'>
              <FontAwesome name='times' />
            </span>
          </a>
        </header>
        <div className='panel-block'>
          <MarbleForm
            schema={this.props.schema}
            formData={this.state.formData}
            onChange={(data) => this.changeHandler(data)}
            onSubmit={() => this.submitHandler()}
            errorMessage={this.state.errorMessage}
            handleMessages={false}
          >
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
                onClick={() => this.resetHandler()}
              >
                Reset
              </button>
            </div>
          </MarbleForm>
        </div>
        {exportUI}
      </div>
    </div>
  }
}

export default MarbleFilterPanel
