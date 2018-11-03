import React from 'react'
import PageComponent from '~base/page-component'

class {{ reactClassName }} extends PageComponent {
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
      <div className='{{ cssClassName }}'>
        <h2>{{ name }}</h2>
      </div>
    )
  }
}

{{ reactClassName }}.config({
  path: '{{ path }}',
  title: '{{ title }}',
  exact: true
})

export default {{ reactClassName }}
