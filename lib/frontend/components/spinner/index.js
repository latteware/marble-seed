import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
class Loader extends Component {
  render () {
    let className = 'columns is-centered is-fullwidth is-flex is-marginless'
    if (this.props.className) {
      className = className + ' ' + this.props.className
    }

    return (<div className={className} style={this.props.style}>
      <div className='column is-half is-narrow has-text-centered is-flex is-justify-center is-align-center'>
        <div>
          <FontAwesome name='spinner' className='fa-2x' spin />
        </div>
      </div>
    </div>)
  }
}

export default Loader
