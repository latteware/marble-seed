import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import api from '~base/api'
import Slider from 'rc-slider'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'

import { BaseTable } from '~base/components/base-table'

class Reports extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectValue: '',
      sortAscending: true,
      sort: 'screenName',
      sortable: true,
      filters: {},
      disableSlider: true,
      selectedRows: {},
      previousRangeValue: 0,
      rangeValue: 0,
      stats: {
        leads: {
          total: 0,
          partial: 0,
          untouched: 0,
          touched: 0,
          contacted: 0,
          uncontacted: 0,
          affiliated: 0,
          appointments: 0,
          days: []
        }
      }
    }

    this.handleOnFilter = this.handleOnFilter.bind(this)
  }

  componentWillMount () {
    this.context.tree.set('users', {
      page: 1,
      totalItems: 0,
      items: [],
      pageLength: 10
    })
    this.context.tree.commit()
    this.loadOrgs()
  }

  async loadOrgs (sort = this.state.sort) {
    const url = '/admin/users/'
    const params = {
      start: 0,
      limit: 0
    }

    if (this.state.sortable) {
      params.sort = (this.state.sortAscending ? '' : '-') + sort
    }

    const body = await api.get(
      url,
      {
        ...params
      }
    )

    this.setState({
      ...this.state,
      reports: body.data.map(function (item) {
        item.count = parseInt(Math.random() * (40 - 1) + 1)
        return item
      })
    })
  }

  getColumns () {
    return [
      {
        'title': 'Screen name',
        'property': 'screenName',
        'default': 'N/A',
        'sortable': true,
        'totals': false
      },
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        'sortable': true,
        'totals': false
      },
      {
        'title': 'Email',
        'property': 'email',
        'default': 'N/A',
        'sortable': true,
        'totals': false
      },
      {
        'title': 'Counts',
        'property': 'count',
        'default': 0,
        'sortable': false,
        'totals': true,
        'editable': true,
        'type': 'number'
      }
    ]
  }

  handleSort (sort) {
    let sortAscending = sort !== this.state.sort ? false : !this.state.sortAscending
    this.setState({sort, sortAscending, selectedRows: {}}, function () {
      this.loadOrgs()
      this.toggleSlider()
    })
  }

  handleOnFilter (filters) {
    this.setState({filters})
  }

  showModal () {
    this.setState({
      className: ' is-active'
    })
  }

  handleChange (data) {
    const reports = this.state.reports.map((item) => data.uuid === item.uuid ? data : item)
    this.setState({reports})
  }

  onChangeSlider (rangeValue) {
    let rows = {...this.state.selectedRows}
    let valueToSum = rangeValue - this.state.previousRangeValue

    for (var item in rows) {
      rows[item].edited = true
      rows[item].count = parseInt(rows[item].count) + (this.state.rangeValue <= rangeValue ? valueToSum : valueToSum)
    }
    this.setState({rangeValue, previousRangeValue: rangeValue})
  }

  onBeforeChangeSlider (previousRangeValue) {
    this.setState({previousRangeValue})
  }

  onAfterChangeSlider (e) {
  }

  toggleSlider () {
    let disable = true
    let rows = {...this.state.selectedRows}
    if (Object.keys(rows).length) disable = false

    this.setState({
      disableSlider: disable,
      rangeValue: disable ? 0 : this.state.rangeValue
    })
  }

  setRowsToEdit (row, index) {
    let rows = {...this.state.selectedRows}

    if (rows.hasOwnProperty(row.uuid)) {
      row.selected = !row.selected
      delete rows[row.uuid]
    } else {
      row.selected = true
      rows[row.uuid] = row
    }

    this.setState({selectedRows: rows}, function () {
      this.toggleSlider()
    })
  }

  selectRows (selectAll) {
    let selectedRows = {}
    let reports = this.state.reports.map((item) => {
      if (selectAll) selectedRows[item.uuid] = item

      item.selected = selectAll
      return item
    })

    this.setState({reports, selectedRows}, function () {
      this.toggleSlider()
    })
  }

  render () {
    const wrapperStyle = { width: 200, margin: '0px 0px 30px 20px' }
    const marks = {
      '-10': '-10',
      '-5': '-5',
      0: <strong>0</strong>,
      5: '5',
      10: '10'
    }
    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1
              className='is-size-3 is-padding-top-small is-padding-bottom-small'
            >
              Reportes
            </h1>
            <div className='card' style={{marginBottom: 20}}>
              <div className='card-content' style={{padding: '1em'}}>

                <div className='columns'>

                  <div className='column'>
                    <button style={{marginRight: 10}} onClick={(e) => this.selectRows(true)} className='button is-light'>Seleccionar todos</button>
                    <button onClick={(e) => this.selectRows(false)} className='button is-light'>Deseleccionar todos</button>
                  </div>
                  <div className='column'>
                    <div style={wrapperStyle} className='is-pulled-right'>
                      <Slider
                        min={-10}
                        max={10}
                        marks={marks}
                        value={this.state.rangeValue}
                        defaultValue={this.state.rangeValue}
                        onChange={(e) => this.onChangeSlider(e)}
                        onAfterChange={(e) => this.onAfterChangeSlider(e)}
                        onBeforeChange={(e) => this.onBeforeChangeSlider(e)}
                        disabled={this.state.disableSlider} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className='card'>
              <div className='card-content is-paddingless'>
                <BaseTable
                  handleSort={(e) => this.handleSort(e)}
                  data={this.state.reports}
                  className='table is-striped is-fullwidth has-text-centered is-marginless'
                  columns={this.getColumns()}
                  sortAscending={this.state.sortAscending}
                  handleChange={(data) => this.handleChange(data)}
                  sortBy={this.state.sort}
                  setRowsToEdit={(row) => this.setRowsToEdit(row)}
                  selectable
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Reports.contextTypes = {
  tree: PropTypes.baobab
}

const branchedReports = branch({users: 'users'}, Reports)

export default Page({
  path: '/reports/users',
  title: 'User reports',
  icon: 'users',
  exact: true,
  validate: loggedIn,
  component: branchedReports
})
