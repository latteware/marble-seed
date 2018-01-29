import React, { Component } from 'react'
import classNames from 'classnames'

const TableHeader = (props) => {
  let icon
  let callbackEvent
  let rowClass

  if (props.abbreviate) {
    return (
      <th><abbr title={props.title}>{props.abbr}</abbr></th>
    )
  }

  if (props.sortable) {
    const iconClass = classNames('fa', {
      'has-text-grey-lighter': props.sortBy !== props.property,
      'fa-sort': props.sortBy !== props.property,
      'has-text-dark': props.sortBy === props.property,
      'fa-sort-asc': props.sortBy === props.property && props.sortAscending,
      'fa-sort-desc': props.sortBy === props.property && !props.sortAscending
    })

    rowClass = 'is-clickable'

    icon = (<i className={iconClass} />)
    callbackEvent = () => props.handleSort(props.property)
  }

  return (
    <th className={rowClass} onClick={callbackEvent}>{props.title || props.children} {icon}</th>
  )
}

const TableData = (props) => {
  return (
    <td>{props.data || props.children}</td>
  )
}

class HeaderRow extends Component {
  render () {
    return <tr>
      {this.props.columns.map(col => (
        <TableHeader sortAscending={this.props.sortAscending} sortBy={this.props.sortBy} handleSort={this.props.handleSort} {...col} key={col.title} />
      ))}
    </tr>
  }
}

class BodyRow extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      inputOnFocus: false,
      inputValue: '',
      inputWidth: null,
      selected: false,
      delay: 250,
      prevent: false,
      toEdit: false
    }

    this.timer = 0
    this.handleDoubleClickItem = this.handleDoubleClickItem.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  handleDoubleClickItem (target, row) {
    this.setState({
      prevent: true,
      toEdit: true,
      inputOnFocus: true,
      inputValue: row.count,
      inputWidth: 90
    }, () => {
      clearTimeout(this.timer)
    })
  }

  handleSingleClickItem (row) {
    if (!this.state.inputOnFocus) {
      let me = this
      me.timer = setTimeout(() => {
        if (!me.state.prevent) {
          me.props.setRowsToEdit(row, this.props.index)
        }
        me.setState({prevent: false})
      }, me.state.delay)
    }
  }

  onChange (value) {
    this.setState({ inputValue: value })
  }

  hideInput () {
    this.setState({ toEdit: false }, function () {
      setTimeout(() => {
        this.setState({inputOnFocus: false})
      }, 300)
    })
  }

  onEnter (row, col, value, event) {
    if (event.charCode === 13) {
      if (row.hasOwnProperty(col.property)) {
        if (col.type === 'number') {
          value = value.replace(/[^0-9.]/g, '')
        }
        row[col.property] = value
        row.edited = true
      }
      this.hideInput()
    }
    this.props.handleChange(row)
  }

  getColumns () {
    if (this.props.columns) {
      const columns = []
      this.props.columns.map((col, i) => {
        if (col.formatter) {
          return columns.push(<td key={i}>{col.formatter(this.props.row) || col.default}</td>)
        }

        const value = this.props.row[col.property] || col.default
        let rowComponent = value

        if (col.editable) {
          if (this.state.toEdit) {
            rowComponent = <input
              type='text'
              className='input'
              value={this.state.inputValue}
              onBlur={(event) => this.hideInput()}
              onKeyPress={(event) => this.onEnter(this.props.row, col, event.target.value, event)}
              onChange={(event) => this.onChange(event.target.value)}
              style={{width: this.state.inputWidth - 24 - 18}}
              autoFocus
            />
          }

          columns.push(<td
            
            key={i}><span><div>{rowComponent || col.default}</div></span></td>)
        } else {
          columns.push(<td key={i}>{value || col.default}</td>)
        }
      })

      return columns
    }

    return null
  }

  getrow () {
    const columns = this.getColumns()
    const rowClass = classNames(this.props.className, {
      'is-selected': this.props.row.selected,
      'is-clickable': true,
      'is-edited': this.props.row.edited && !this.props.row.selected
    })

    if (this.props.selectable) {
      return <tr
        className={rowClass}
        onClick={(event) => this.handleSingleClickItem(this.props.row)}
        onDoubleClick={(event) => this.handleDoubleClickItem(event.target, this.props.row)}>
        {columns || this.props.children}
      </tr>
    }

    return <tr>
      {columns || this.props.children}
    </tr>
  }

  render () {
    return this.getrow()
  }
}

class TableHead extends Component {
  render () {
    return (
      <thead>
        <HeaderRow sortAscending={this.props.sortAscending} sortBy={this.props.sortBy} handleSort={this.props.handleSort} columns={this.props.columns} />
      </thead>
    )
  }
}

class TableFoot extends Component {
  render () {
    return (
      <tfoot>
        <HeaderRow columns={this.props.columns} />
      </tfoot>
    )
  }
}

class TableTotals extends Component {
  getColumns () {
    if (this.props.data && this.props.columns) {
      const columns = this.props.columns.map((col, i) => {
        let totals

        if (col.totals) {
          totals = this.props.data.map(function (item) {
            return item[this.property]
          }, col)
          .reduce((total, num) => parseInt(total || 0) + parseInt(num || 0))
        }

        return (<td className='is-dark' key={i}>{totals}</td>)
      })

      columns.shift()
      columns.unshift(<td className='is-dark' key={columns.length + 1}>Totales</td>)

      return columns
    }
    return null
  }

  render () {
    let columns = this.getColumns()
    return (
      <tfoot>
        <tr>{columns}</tr>
      </tfoot>
    )
  }
}

class TableBody extends Component {
  getBody () {
    if (this.props.data) {
      return (
        this.props.data.map((row, i) => (
          <BodyRow selectable={this.props.selectable} setRowsToEdit={this.props.setRowsToEdit} onClick={this.props.onClick} key={i} index={i} row={row} columns={this.props.columns} className={this.props.className} handleChange={this.props.handleChange} />
        ))
      )
    }
    return null
  }

  render () {
    return (
      <tbody>
        {this.getBody()}
        {this.props.children}
      </tbody>
    )
  }
}

class SimpleTable extends Component {
  render () {
    const {
      className
    } = this.props
    return (
      <table className={className || 'table is-fullwidth'}>
        {this.props.children}
      </table>
    )
  }
}

class BaseTable extends Component {
  getFoot () {
    if (this.props.has_foot) {
      return <TableFoot columns={this.props.columns} />
    }

    if (this.props.columns.some(item => item.totals)) {
      return <TableTotals columns={this.props.columns} data={this.props.data} />
    }
  }

  render () {
    const {
      className,
      columns,
      data
    } = this.props

    return (<div className='is-relative'>
      <SimpleTable className={className}>
        <TableHead sortAscending={this.props.sortAscending} sortBy={this.props.sortBy} handleSort={this.props.handleSort} columns={columns} />
        <TableBody selectable={this.props.selectable} setRowsToEdit={this.props.setRowsToEdit} onClick={this.props.onClick} data={data} columns={columns} handleChange={this.props.handleChange} />
        {this.getFoot()}
      </SimpleTable>
    </div>
    )
  }
}

export {
  BaseTable,
  SimpleTable,
  TableHead,
  TableFoot,
  TableBody,
  HeaderRow,
  BodyRow,
  TableData,
  TableHeader
}
