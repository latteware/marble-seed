import React, { Component } from 'react'

import PanelDisplayData from './../../../../stories/components/panelDisplay/panel'

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
    
    this.AddData = this.AddData.bind(this)    
    this.removeAllData = this.removeAllData.bind(this)
    this.handlerRemoveItem = this.handlerRemoveItem.bind(this)
  }   

  AddData () {
    this.setState({dataList: data})    
  }

  removeAllData () {
    this.setState({dataList: []})
  }

  handlerRemoveItem (itemId) {
		const itemRemoveId = this.state.dataList.findIndex(x => x.id === itemId)
		const removeItem = this.state.dataList.splice(itemRemoveId, 1)

		this.setState({dataList: this.state.dataList})
	}

  render () {
    return (
      <div className="columns">
        <div className="column">
          <h1>
            <a className="button " onClick={this.removeAllData}>Empty</a>
            <a className="button" onClick={this.AddData}>Data</a>
            <a className="button ">of Data</a>
          </h1>
        </div>
        <div className="column">
          <PanelDisplayData
            data={this.state.dataList}
            onRemoveItem={this.handlerRemoveItem}
          />
        </div>
      </div>
    )
  }
}

export default DisplayData