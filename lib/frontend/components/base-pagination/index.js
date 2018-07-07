import React, { Component } from 'react'

class Pagination extends Component {
  componentWillMount () {
    this.getPages(this.props)
  }

  componentWillUpdate (nextProps) {
    this.getPages(nextProps)
  }

  getPages (props) {
    this.pagesTotal = Math.ceil(props.totalItems / props.pageLength)
    this.pages = []
    let auxPag = (props.page < 3 ? 1 : props.page - 2)
    for (var i = 0; i < 5 && i < this.pagesTotal; i++) {
      if (auxPag + i > this.pagesTotal) break
      this.pages.push(auxPag + i)
    }
  }

  getFirstButton () {
    if (this.props.page > 1) {
      return (<a
        className='pagination-previous'
        onClick={() => this.loadFirst()}
        >
        First
      </a>)
    }
    return (<a
      className='pagination-previous'
      disabled
      >
      First
    </a>)
  }

  getLastButton () {
    if (this.props.page < this.pagesTotal) {
      return (<a
        className='pagination-next'
        onClick={() => this.loadLast()}
        >
        Last
      </a>)
    }
    return (<a
      className='pagination-next'
      disabled
      >
      Last
    </a>)
  }

  getPrevButton () {
    if (this.props.page > 1) {
      return (
        <a
          className='pagination-previous'
          onClick={() => this.loadPrevious()}
          title={'Page' + (this.props.page - 1)}
          >
          Previous
        </a>
      )
    }
    return (
      <a
        className='pagination-previous'
        title={'Page' + (this.props.page - 1)}
        disabled
        >
        Previous
      </a>
    )
  }

  getNextButton () {
    if (this.props.page < this.pagesTotal) {
      return (
        <a
          className='pagination-next'
          onClick={() => this.loadNext()}
          title={'Page' + (this.props.page + 1)}
          >
          Next
        </a>
      )
    }
    return (
      <a
        className='pagination-next'
        title={'Page' + (this.props.page + 1)}
        disabled
        >
        Next
      </a>
    )
  }

  loadFirst () {
    this.loadPageWrapper(1)
  }

  loadLast () {
    this.loadPageWrapper(this.pagesTotal)
  }

  loadNext () {
    this.loadPageWrapper(this.props.page + 1)
  }

  loadPrevious () {
    this.loadPageWrapper(this.props.page - 1)
  }

  loadPageWrapper (pageNumber) {
    this.props.loadPage(pageNumber)
  }

  render () {
    return (
      <div>
        <nav className='pagination is-centered' role='navigation' aria-label='pagination'>
          <ul className='pagination-list' style={{ listStyle: 'none' }}>
            <li>
              {this.getFirstButton()}
            </li>
            <li>
              {this.getPrevButton()}
            </li>
            {this.pages.map(page =>
              <li key={page}>
                <a
                  className={
                    this.props.page === page ? 'pagination-link is-current' : 'pagination-link'
                  }
                  aria-label={'Page ' + page}
                  aria-current={
                    this.props.page === page ? 'page' : ''
                  }
                  onClick={() => this.loadPageWrapper(page)}
                >
                  {page}
                </a>
              </li>
            )}
            <li>
              {this.getNextButton()}
            </li>
            <li>
              {this.getLastButton()}
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export { Pagination }
