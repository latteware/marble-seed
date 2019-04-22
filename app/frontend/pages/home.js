import React from 'react'
import PageComponent from '~base/page-component'

import { forcePublic } from '~base/middlewares/'

class Home extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...this.baseState
    }
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    return (
      <section className='home hero is-info bsa'>
        <div className='container'>
          <div className='columns is-vcentered'>
            <div className='column is-4'>
              <p className='title'>Home</p>
              <p className='subtitle'>Welcome to marble seeds!</p>
            </div>

            <div className='column is-8'>
              <div className='bsa-cpc' />
            </div>
          </div>
        </div>
      </section>
    )
  }
}

Home.config({
  path: '/',
  title: 'Home',
  validate: forcePublic,
  exact: true
})

export default Home
