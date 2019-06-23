import React, { Component } from 'react'
import Link from '~base/router/link'
import FontAwesome from 'react-fontawesome'
import classNames from 'classnames'

class SidebarItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      menuIsCollapsed: false
    }

    this.getDropdownButton = this.getDropdownButton.bind(this)
    this.getItemLink = this.getItemLink.bind(this)
  }

  componentWillMount () {
    this.setState({ open: this.props.status })
  }

  componentWillReceiveProps (nextProp) {
    const { to, activeItem, dropdownOnClick, index } = this.props
    const mainPath = new RegExp(to.replace(/\//g, ''))

    if (nextProp.collapsed !== this.state.menuIsCollapsed) {
      this.setState({ menuIsCollapsed: nextProp.collapsed }, function () {
        if (mainPath.test(activeItem) && !nextProp.collapsed) {
          dropdownOnClick(index)
        }
      })
    }

    if (nextProp.status !== this.state.open) {
      this.setState({ open: nextProp.status })
    }
  }

  getItemLink (to, icon, title, onClick) {
    let activeLink = to.replace(/\//g, '')

    const linkTitleClass = classNames('item-link-title', {
      'is-hidden': this.state.menuIsCollapsed
    })

    return (<Link
      className={this.props.activeItem === activeLink ? 'is-active' : ''}
      to={to}
      onClick={() => onClick(activeLink, title)}>
      <span className='icon'>
        <FontAwesome className='has-text-white' name={icon} />
      </span>
      <span className={linkTitleClass}> {title}</span>
    </Link>)
  }

  getDropdownButton (to, icon, title, toggle, dropdownItems) {
    const mainPath = new RegExp(to.replace(/\//g, ''))
    const isActive = mainPath.test(this.props.activeItem)
    const arrowColorClass = classNames('icon is-pulled-right', {
      'has-text-primary': !isActive,
      'has-text-white': isActive
    })

    const dropdownClass = classNames('', {
      'dropdown': this.state.menuIsCollapsed,
      'is-active': isActive
    })

    if (this.state.menuIsCollapsed) {
      return (<div
        className={dropdownClass}
        onMouseEnter={() => toggle(this.props.index)}
        onMouseLeave={() => toggle(this.props.index)}
        href='javascript:void(0)' >
        <span className='icon has-text-white'>
          <FontAwesome name={icon} />
        </span>
        {dropdownItems}
      </div>)
    } else {
      return (<div>
        <a href='javascript:void(0)'
          className={isActive ? 'is-active' : ''}
          onClick={() => toggle(this.props.index)}>
          <span className='icon'>
            <FontAwesome className='has-text-white' name={icon} />
          </span>
          <span className='item-link-title'> {title}</span>
          <span className={arrowColorClass}>
            <FontAwesome name={this.state.open ? 'angle-down' : 'angle-right'} />
          </span>
        </a>
        {dropdownItems}
      </div>)
    }
  }

  render () {
    let { title, icon, to, dropdown, onClick, dropdownOnClick } = this.props
    let mainLink = this.getItemLink(to, icon, title, onClick)
    let dropdownItems

    if (dropdown) {
      dropdownItems = (<ul className={this.state.open ? '' : 'is-hidden'}>{dropdown.map((e, i) => {
        return (<li key={e.title.toLowerCase().replace(/\s/g, '')}>
          {this.getItemLink(e.to, e.icon, e.title, onClick)}
        </li>)
      })}</ul>)
      mainLink = this.getDropdownButton(to, icon, title, dropdownOnClick, dropdownItems)
    }

    return (<li>
      {mainLink}
    </li>)
  }
}

export default SidebarItem
