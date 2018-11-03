import React, { Component } from 'react'

class {{ className }} extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return <div className='{{ slug }}'>
      {{ name }}
    </div>
  }
}

export default {{ className }}
