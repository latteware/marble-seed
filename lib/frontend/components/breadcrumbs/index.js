import React, { Component } from 'react'
import Link from '~base/router/link'

class Breadcrumbs extends Component {
  getItem (item, active) {
    let isActive
    if (active) { isActive = 'is-active' }

    return <li key={item.key} className={isActive}><Link to={item.path}>{item.label}</Link></li>
  }

  render () {
    const { breadcrumbs } = this.props

    return (<nav className='breadcrumb' aria-label='breadcrumbs'>
      <ul>
        {breadcrumbs.map((item, i) => this.getItem({ ...item, key: i }, i === breadcrumbs.length - 1))}
      </ul>
    </nav>)
  }
}

export default Breadcrumbs
