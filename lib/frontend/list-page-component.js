import React from 'react'

import api from '~base/api'
import PageComponent from './page-component'
import { BranchedPaginatedTable } from '~base/components/base-paginated-table'
import BaseMultiFilterPanel from '~base/components/base-multifilter'
import download from 'downloadjs'
import json2csv from 'json2csv'
import classNames from 'classnames'
import Loader from '~base/components/spinner'

class ListPageComponent extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      filters: {},
      selectedRows: [],
      loadRequest: new Date(),
      exporting: false,
      defaultFilters: false,
      formData: this.setFormData()
    }
    this.setFormData = this.setFormData.bind(this)
  }

  reload () {
    this.setState({
      selectedRows: [],
      loadRequest: new Date()
    })
  }

  setFormData () {
    const filters = this.getFilters()
    let obj = {}
    for (var item in filters.uiSchema) {
      obj[item] = ''
    }
    return obj
  }

  finishUp (data) {
    this.setState({
      className: ''
    })
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

    await this.handleOnExport({
      ...this.state.defaultFilters,
      ...filters
    }, this.state.filename)
    this.setState({ exporting: false })
  }

  getHeader () {
    const config = this.config

    if (config.headerLayout === 'custom') {
      return <config.headerComponent
        reload={() => this.reload()}
        {...this.state}
      />
    } else if (config.headerLayout === 'create') {
      let exportUI
      if (this.exportFormatter) {
        const classNameExport = classNames('button btn-export', {
          'is-loading': this.state.exporting
        })

        exportUI = <button onClick={(e) => this.onExport(e)} className={classNameExport}>
          <i className='fa fa-download' /> Export
        </button>
      }
      return (<header className='card-header'>
        <p className='card-header-title'>
          {config.title}
        </p>
        <div className='card-header-select'>
          {exportUI}
          <button className='button is-primary' onClick={() => this.showModal()}>
            {config.createComponentLabel}
          </button>
          <config.createComponent
            className={this.state.className}
            hideModal={() => this.hideModal()}
            finishUp={(data) => this.finishUp(data)}
            branchName={config.cursorName}
            baseUrl={config.apiUrl}
            url={config.apiUrl}
          />
        </div>
      </header>)
    } else {
      return (<header className='card-header'>
        <p className='card-header-title'>
          {config.title}
        </p>
      </header>)
    }
  }

  handleOnFilter (data) {
    this.setState({filters: data})
  }

  async handleOnExport (data, filename) {
    const config = this.config
    const params = {
      start: 0,
      limit: 1000000 // ToDo: change mongoose data tables to support limit: 'all'
    }

    const body = await api.get(config.apiUrl, {
      ...this.state.filters,
      ...params
    })

    let csvArray = []
    if (body.data.length) {
      csvArray = body.data.map(row => this.exportFormatter(row))
    }

    const csv = json2csv.parse(csvArray)
    download('data:text/csv;charset=utf-8,' + csv, (filename || config.name) + '.csv', 'data:text/plain; charset=utf-8')
  }

  onSelectChange (items) {
    this.setState({
      selectedRows: items
    })
  }

  render () {
    const config = this.config
    const filters = this.getFilters()

    const filterConfig = {
      name: {
        label: 'Por nombre',
        type: 'text',
        widget: 'TextInput',
        placeHolder: '',
        field: 'screenName'
      },
      email: {
        label: 'Por email',
        type: 'email',
        widget: 'EmailInput',
        placeHolder: '',
        field: 'email'
      },
      types: {
        label: 'Por tipo',
        type: 'text',
        widget: 'SelectInput',
        placeHolder: '',
        values: [{ value: 'simple', label: 'Simple' }, { value: 'complex', label: 'Complex' }],
        field: 'organization'
      }

    }

    if (!this.state.loaded) {
      return <Loader />
    }

    let filterComponent
    if (filters && filters.schema) {
      filterComponent = (
        <BaseMultiFilterPanel
          schema={filters.schema}
          uiSchema={filters.uiSchema}
          filters={{...config.defaultFilters, ...this.state.filters}}
          export={!!this.exportFormatter}
          onFilter={(data) => this.handleOnFilter(data)}
          onExport={(data) => this.handleOnExport(data, this.state.filename)}
          config={filterConfig}
        />
      )
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>{config.title}</h1>
            <div className='card'>
              {this.getHeader()}
              <div className='card-content'>
                <div className='columns'>
                  <div className='column'>
                    {filterComponent}
                    <BranchedPaginatedTable
                      loadRequest={this.state.loadRequest}
                      branchName={config.cursorName}
                      baseUrl={config.apiUrl}
                      columns={this.getColumns()}
                      selectable={config.selectable}
                      sortedBy={config.sortBy || 'name'}
                      onSelectChange={(items) => this.onSelectChange(items)}
                      filters={{...config.defaultFilters, ...this.state.filters}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ListPageComponent
