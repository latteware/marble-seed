import React, { Component } from 'react'

import PanelDisplayData from './../../../../stories/components/panelDisplay/panel'

const data = [
  {id: '4rgsda24', text: 'Text 1'},
  {id: '5tggeq35', text: 'Text 2'},
  {id: 'tb52ds51', text: 'Text 3'},
  {id: 'gg43tsfr', text: 'Text 4'},
  {id: 'gr3w5dw3', text: 'Text 5'},
	{id: 'b52fd353', text: 'Text 6'},
	{id: '353whdt3', text: 'Text 7'},
	{id: 'jr7w58d7', text: 'Text 8'},
	{id: '873j55w6', text: 'Text 9'},
	{id: '9r385dw3', text: 'Text 10'},
	{id: 'gr6w9dwv', text: 'Text 11'},
	{id: 'grkwldwj', text: 'Text 12'},
	{id: 'kr5w5dwl', text: 'Text 13'},
]

class DisplayData extends Component {
  constructor () {
    super()
    this.state = {
      value: 'value state',
      dataList: [],
			currentPage: 1,
			todosPerPage: 10,
    }
    
    this.AddData = this.AddData.bind(this)    
    this.removeAllData = this.removeAllData.bind(this)
		this.handlerPageNumber = this.handlerPageNumber.bind(this)		
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

	handlerPageNumber(event) {
		this.setState({
			currentPage: Number(event.target.id)
		});
	}

  render () {
		const { dataList, currentPage, todosPerPage } = this.state;
		const indexOfLastData = currentPage * todosPerPage
		const indexOfFirstData = indexOfLastData - todosPerPage
		const currentData = dataList.slice(indexOfFirstData, indexOfLastData)

		const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(dataList.length / todosPerPage); i++) {
    	pageNumbers.push(i);
    }

    return (
      <div className="columns">
        <div className="column">
          <h1>
            <a className="button " onClick={this.removeAllData}>Empty</a>
            <a className="button" onClick={this.AddData}>Data</a>
            <a className="button ">Lots of Data</a>
          </h1>
        </div>
        <div className="column">
          <PanelDisplayData
            data={currentData}
						pageNumbers={pageNumbers}
            onRemoveItem={this.handlerRemoveItem}
						onPageNumber={this.handlerPageNumber}
          />
        </div>
      </div>
    )
  }
}

export default DisplayData