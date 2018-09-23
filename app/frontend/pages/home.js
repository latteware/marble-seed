import React from 'react'
import PageComponent from '~base/page-component'

class Home extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
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
  exact: true
})

export default Home
