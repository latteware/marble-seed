import React, { Component } from 'react'

import PanelDisplayData from './panel'

const data = [
  {id: '4rgsda24', text: 'Text 1'},
  {id: '5tggeq35', text: 'Text 2'},
  {id: 'tb52ds51', text: 'Text 3'},
  {id: 'gg43tsfr', text: 'Text 4'},
  {id: 'gr3w5dw3', text: 'Text 5'}
]

class DisplayData extends Component {
  constructor () {
    super()
    this.state = {
      value: 'value state',
      dataList: [],
     
    }
  }   

  AddData () {
    this.setState({dataList: data})    
  }

  removeData () {
    this.setState({dataList: []})
  }

  render () {
    return (
      <div className="columns">
        <div className="column">
          <h1>
            <a className="button " onClick={this.removeData.bind(this)}>Empty</a>
            <a className="button" onClick={this.AddData.bind(this)}>Data</a>
            <a className="button ">of Data</a>
          </h1>
        </div>
        <div className="column">
          <PanelDisplayData data={this.state.dataList}/>
        </div>
      </div>
    )
  }

}

export default DisplayData