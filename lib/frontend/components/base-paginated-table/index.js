import React, { Component } from 'react'
import api from '~base/api'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'

import { Pagination } from '~base/components/base-pagination'
import { BaseTable } from '~base/components/base-table'

import Loader from '~base/components/spinner'

class PaginatedTable extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loaded: false,
      loading: true,
      sortAscending: true,
      itemsSelected: this.props.itemsSelected || [],
      sort: this.props.sortedBy || props.columns.find((column) => column.property).property,
      sortable: props.columns.some((column) => column.sortable)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (JSON.stringify(nextProps.filters) !== JSON.stringify(this.props.filters)) {
      this.setState({ loading: true, loaded: false }, () => {
        this.load(nextProps.filters)
      })
    }

    if (nextProps.loadRequest !== this.state.loadRequest) {
      this.setState({
        loadRequest: nextProps.loadRequest,
        checkedAll: false,
        itemsSelected: []
      })
      this.load()
    }
  }

  componentWillMount () {
    this.cursor = this.context.tree.select(this.props.branchName)
    this.load()
  }

  async load (filters = this.props.filters, sort = this.state.sort) {
    const params = {
      start: 0,
      limit: this.cursor.get('pageLength') || 10
    }
    if (this.state.sortable) {
      params.sort = (this.state.sortAscending ? '' : '-') + sort
    }
    const body = await api.get(
      this.props.baseUrl,
      {
        ...filters,
        ...params
      }
    )

    this.cursor.set({
      page: 1,
      totalItems: body.total,
      items: body.data,
      pageLength: this.cursor.get('pageLength') || 10
    })
    this.context.tree.commit()

    this.setState({ loading: false, loaded: true })
  }

  async loadMore (page, sort = this.state.sort) {
    this.setState({ loading: true, loaded: false })

    const params = {
      start: (page - 1) * this.cursor.get('pageLength'),
      limit: this.cursor.get('pageLength')
    }
    if (this.state.sortable) {
      params.sort = (this.state.sortAscending ? '' : '-') + sort
    }

    const body = await api.get(
      this.props.baseUrl,
      {
        ...this.props.filters,
        ...params
      }
    )

    this.cursor.set({
      page: page,
      totalItems: body.total,
      items: body.data,
      pageLength: this.cursor.get('pageLength')
    })
    this.context.tree.commit()

    this.setState({ loading: false, loaded: true })
  }

  handleSort (sort) {
    let sortAscending = sort !== this.state.sort ? false : !this.state.sortAscending
    this.setState({ sort, sortAscending }, function () {
      this.load()
    })
  }

  handleSelectAll () {
    const onSelectChange = this.props.onSelectChange
    const items = this.cursor.get('items')
    let itemsSelected

    if (this.state.checkedAll) {
      itemsSelected = []
      this.setState({
        itemsSelected,
        checkedAll: !this.state.checkedAll
      })
    } else {
      itemsSelected = items
      this.setState({
        itemsSelected,
        checkedAll: !this.state.checkedAll
      })
    }

    if (onSelectChange) {
      onSelectChange(itemsSelected)
    }
  }

  onChecked (row) {
    const onSelectChange = this.props.onSelectChange
    const items = this.cursor.get('items')
    let { itemsSelected } = this.state

    const item = itemsSelected.find(item => item.uuid === row.uuid)

    if (!item) {
      itemsSelected = itemsSelected.concat(row)
    } else {
      itemsSelected = itemsSelected.filter(item => item.uuid !== row.uuid)
    }

    this.setState({
      itemsSelected,
      checkedAll: itemsSelected.length === items.length
    })

    if (onSelectChange) {
      onSelectChange(itemsSelected)
    }
  }

  getColumns () {
    const { selectable, columns } = this.props
    const { itemsSelected, checkedAll } = this.state

    if (selectable) {
      return [
        {
          title: 'Select all',
          abbreviate: true,
          abbr: <input
            type='checkbox'
            onChange={() => this.handleSelectAll()}
            checked={checkedAll}
          />,
          property: 'checkbox',
          formatter: (row) => {
            return <input
              type='checkbox'
              onChange={() => this.onChecked(row)}
              checked={!!itemsSelected.find(item => item.uuid === row.uuid)}
            />
          }
        },
        ...columns
      ]
    }

    return columns
  }

  render () {
    if (this.state.loading) {
      return <Loader />
    }

    const columns = this.getColumns()

    return (
      <div>
        <BaseTable
          handleSort={(e) => this.handleSort(e)}
          data={this.cursor.get('items')}
          columns={columns}
          sortAscending={this.state.sortAscending}
          sortBy={this.state.sort} />
        <Pagination
          loadPage={(page) => this.loadMore(page)}
          {...this.cursor.get()}
        />
      </div>
    )
  }
}

PaginatedTable.contextTypes = {
  tree: PropTypes.baobab
}

const BranchedPaginatedTable = branch((props, context) => {
  return {
    data: props.branchName
  }
}, PaginatedTable)

export {
  BranchedPaginatedTable,
  PaginatedTable
}
