import React, { Component } from 'react'
import SidebarItem from '~components/sidebar-item'
import classNames from 'classnames'

import Dashboard from '../pages/dashboard'
import Users from '../pages/users/list'
import DeletedUsers from '../pages/users/list-deleted'
import UsersImport from '../pages/users/import'
import Organizations from '../pages/organizations/list'
import Roles from '../pages/roles/list'
import Groups from '../pages/groups/list'

import RequestLogs from '../pages/request-logs/list'
import Reports from '../pages/reports/users'
import Image from '~base/components/image'
import Link from '~base/router/link'

class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dropdown: true,
      active: '',
      collapsed: false,
      menuItems: []
    }
    this.handleActiveLink = this.handleActiveLink.bind(this)
  }

  componentWillMount () {
    const activeItem = window.location.pathname.split('/').filter(String).slice(1).join('')
    let menuItems = this.getMenuItems()
    let IndexOfActive = menuItems.findIndex(function (item) {
      const mainPath = new RegExp(item.to.replace(/\//g, ''))
      if (!item.hasOwnProperty('dropdown')) return false
      return mainPath.test(activeItem)
    })
    if (IndexOfActive >= 0) {
      menuItems[IndexOfActive].open = true
    }
    this.setState({ menuItems }, function () {
      this.handleActiveLink(activeItem)
    })
  }

  getMenuItems () {
    return [
      Dashboard.asSidebarItem(),
      {
        title: 'Manage Your Team',
        icon: 'users',
        to: '/manage',
        open: false,
        dropdown: [
          Users.asSidebarItem(),
          DeletedUsers.asSidebarItem(),
          Organizations.asSidebarItem(),
          Roles.asSidebarItem(),
          Groups.asSidebarItem()
        ]
      }, {
        title: 'Load Data',
        icon: 'file-o',
        to: '/import',
        open: false,
        dropdown: [
          UsersImport.asSidebarItem()
        ]
      }, {
        title: 'Developer Tools',
        icon: 'github-alt',
        to: '/devtools',
        open: false,
        dropdown: [
          RequestLogs.asSidebarItem()
        ]
      }, {
        title: 'Reports',
        icon: 'github-alt',
        to: '/reports',
        open: false,
        dropdown: [
          Reports.asSidebarItem()
        ]
      }
    ]
  }

  handleActiveLink (item, title) {
    if (title && this.props.handleBurguer) {
      this.props.handleBurguer()
    }
    this.setState({active: item})
  }

  handleCollapse () {
    const menuItems = [...this.state.menuItems]
    this.setState({
      collapsed: !this.state.collapsed,
      menuItems: menuItems.map(item => {
        item.open = false
        return item
      })
    })
  }

  handleToggle (index) {
    const menuItems = [...this.state.menuItems]
    menuItems[index].open = !menuItems[index].open
    this.setState({menuItems})
  }

  render () {
    let divClass = 'offcanvas column is-narrow is-narrow-mobile is-narrow-tablet is-narrow-desktop  is-paddingless'
    const menuClass = classNames('menu', {
      'menu-collapsed': this.state.collapsed
    })
    const imgClass = classNames('img-logo', {
      'icon-img': this.state.collapsed,
      'icon-img-text': !this.state.collapsed
    })

    const collapseBtn = classNames('fa', {
      'fa-expand': this.state.collapsed,
      'fa-compress': !this.state.collapsed
    })
    let fileImg = (this.state.collapsed) ? 'icono-white.svg' : 'horizontal-white.svg'

    if (!this.props.burgerState) {
      divClass = divClass + ' is-hidden-touch'
    }

    return (<div className={divClass}>
      <aside className={menuClass}>
        <Link to='/' className='navbar-item c-flex-1 is-dark is-paddingless'>
          <Image className={imgClass} src={'/public/img/' + fileImg} width='200' height='100' alt='Logotipo' />
        </Link>
        <a onClick={() => this.handleCollapse()} className='button is-primary collapse-btn'>
          <span className='icon is-small'>
            <i className={collapseBtn} />
          </span>
        </a>
        <ul className='menu-list'>
          {this.state.menuItems.map((item, index) => {
            if (!item) { return }
            return <SidebarItem
              title={item.title}
              index={index}
              status={item.open}
              collapsed={this.state.collapsed}
              icon={item.icon}
              to={item.to}
              dropdown={item.dropdown}
              onClick={this.handleActiveLink}
              dropdownOnClick={(i) => this.handleToggle(i)}
              activeItem={this.state.active}
              key={item.title.toLowerCase().replace(/\s/g, '')} />
          })}
        </ul>
      </aside>
    </div>)
  }
}

export default Sidebar
