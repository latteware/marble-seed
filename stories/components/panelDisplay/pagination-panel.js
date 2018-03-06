import React, { Component } from 'react'

class PaginationPanel extends Component {
  constructor () {
    super()
  }

  render () {
    console.log(this.props.pageNumbers)
    const renderPageNumber = this.props.pageNumbers.map(number => {
      return (
        <li key={number}>
          <a 
            className="pagination-link is-current" 
            aria-label="Page 1" 
            aria-current="page"
            id={number}
            onClick={this.props.onPageNumber}
          >{number}</a>
        </li>
      )
    })

    return (
      <nav className="pagination" role="navigation" aria-label="pagination">
        <a className="pagination-previous" title="This is the first page" disabled>Previous</a>
        <a className="pagination-next">Next page</a>
        <ul className="pagination-list">
          {renderPageNumber}
        </ul>
      </nav>
    )
  } 
} 

export default PaginationPanel