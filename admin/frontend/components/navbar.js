import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { branch } from 'baobab-react/higher-order'
import { withRouter } from 'react-router'

import storage from '~base/storage'
import tree from '~core/tree'

class AdminNavBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mobileMenu: 'close',
      redirect: false
    }
  }

  handleLogout () {
    const {history} = this.props

    storage.remove('jwt')
    tree.set('jwt', null)
    tree.set('user', null)
    tree.set('loggedIn', false)
    tree.commit()

    history.push('/')
  }

  handleNavbarBurgerClick () {
    if (this.state.mobileMenu === 'open') {
      this.setState({mobileMenu: 'close'})
    } else {
      this.setState({mobileMenu: 'open'})
    }
  }

  render () {
    var navbarMenuClassName = 'navbar-menu'
    if (this.state.mobileMenu === 'open') {
      navbarMenuClassName = 'navbar-menu is-active'
    }

    var navButtons
    if (this.props.loggedIn) {
      navButtons = (<div className='field is-grouped'>
        <p className='control'>
          <button className='bd-tw-button button' onClick={() => this.handleLogout()}>Log out</button>
        </p>
      </div>)
    } else {
      navButtons = (<div className='field is-grouped'>
        <p className='control'>
          <Link className='bd-tw-button button' to='/log-in'>Log in</Link>
        </p>
        <p className='control'>
          <Link className='bd-tw-button button is-primary' to='/sign-up'>Sign up</Link>
        </p>
      </div>)
    }

    return (
      <nav className='navbar'>
        <div className='navbar-brand'>
          <Link className='navbar-item' to='/'>
            <h1>Marble Seeds</h1>
          </Link>

          <div className='navbar-burger burger' onClick={(e) => this.handleNavbarBurgerClick(e)}>
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={navbarMenuClassName}>
          <div className='navbar-start' />
          <div className='navbar-end'>
            <div className='navbar-item'>
              {navButtons}
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(branch({
  loggedIn: 'loggedIn'
}, AdminNavBar))
