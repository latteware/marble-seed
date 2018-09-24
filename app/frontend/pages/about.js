import React from 'react'
import PageComponent from '~base/page-component'

class AboutPage extends PageComponent {
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
      <div className='About'>
        <h2>About</h2>
      </div>
    )
  }
}

AboutPage.config({
  path: '/about',
  title: 'About',
  exact: true
})

export default AboutPage
