import React, { Component } from 'react'

import ItemList from './../../../lib/frontend/components/base-item-list'

const lotsOfData = [
  {id: '4rgsda24', text: 'Text 1'},
  {id: '5tggeq35', text: 'Text 2'},
  {id: 'tb52ds51', text: 'Text 3'},
  {id: '2g43tsfr', text: 'Text 4'},
  {id: 'gr3w5dw3', text: 'Text 5'},
  {id: 'b52fd353', text: 'Text 6'},
  {id: '353whdt3', text: 'Text 7'},
  {id: 'jr7w58d7', text: 'Text 8'},
  {id: '873j55w6', text: 'Text 9'},
  {id: '9r385dw3', text: 'Text 10'},
  {id: 'gt6w9dwv', text: 'Text 11'},
  {id: '6rkwldwj', text: 'Text 12'},
  {id: 'dr3w5dwl', text: 'Text 13'},
  {id: 'kr1widwl', text: 'Text 14'},
  {id: '5rgw2hwl', text: 'Text 15'},
  {id: '4rgsga24', text: 'Text 16'},
  {id: '5tggrq35', text: 'Text 17'},
  {id: 'tbe2ds51', text: 'Text 18'},
  {id: '1v33tsfr', text: 'Text 19'},
  {id: '1r3w5dw3', text: 'Text 20'},
  {id: 'b52fd373', text: 'Text 21'},
  {id: '353whft3', text: 'Text 22'},
  {id: 'jr7j58d7', text: 'Text 23'},
  {id: '873g55w6', text: 'Text 24'},
  {id: '9r35ddw3', text: 'Text 25'},
  {id: 'gr6w9dw6', text: 'Text 26'},
  {id: 'r4wldwhj', text: 'Text 27'},
  {id: 'dr3y5dbl', text: 'Text 28'},
  {id: 'br1wid5l', text: 'Text 29'},
  {id: '0rgw2hml', text: 'Text 30'}
]

const data = [
  {id: '4rgsda24', text: 'Texto 1'},
  {id: '5tggeq35', text: 'Texto 2'},
  {id: 'tb52ds51', text: 'Texto 3'},
  {id: 'gg43tsfr', text: 'Texto 4'},
  {id: 'gr3w5dw3', text: 'Texto 5'}
]

class PanelDisplayItems extends Component {
  render () {
    return (
      <div className='card'>
        <header className='card-header'>
          <p className='card-header-title'>
            TItulo
          </p>
        </header>
        <div className='card-content'>
          <div className='content'>
            <div className='field is-grouped'>
              <p className='control'>
                <input
                  className='input'
                  type='text'
                  value={this.props.value}
                  onChange={this.props.onChangeData}
                />
              </p>
              <p className='control'>
                <button
                  className='button is-info'
                  onClick={this.props.onSaveData}
                >
                  Add
                </button>
              </p>
            </div>
            <ItemList
              items={this.props.items}
              onRemoveItem={this.props.onRemoveItem}
            />
          </div>
        </div>
      </div>
    )
  }
}

class DisplayItems extends Component {
  constructor () {
    super()
    this.state = {
      inputValue: '',
      dataList: []
    }
    this.addData = this.addData.bind(this)
    this.addLotsOfData = this.addLotsOfData.bind(this)
    this.removeAllData = this.removeAllData.bind(this)
    this.handlerRemoveItem = this.handlerRemoveItem.bind(this)
  }

  addData () {
    this.setState({dataList: data})
  }

  addLotsOfData () {
    this.setState({dataList: lotsOfData})
  }

  removeAllData () {
    this.setState({dataList: []})
  }

  handlerChangeData (event) {
    this.setState({inputValue: event.target.value})
  }

  handlerSaveData () {
    if (this.state.inputValue) {
      var itemData = {
        id: Math.random().toString(36).substr(2, 16),
        text: this.state.inputValue
      }
      this.setState({
        dataList: this.state.dataList.concat([itemData]),
        inputValue: this.state.inputValue = ''
      })
    }
  }

  handlerRemoveItem (itemId) {
    const itemRemoveId = this.state.dataList.findIndex(x => x.id === itemId)
    this.state.dataList.splice(itemRemoveId, 1)

    this.setState({dataList: this.state.dataList})
  }

  render () {
    const pre = JSON.stringify(this.state.dataList, null, 2)

    return (
      <div className='columns'>
        <div className='column is-one-quarter'>
          <h1>
            <a className='button' onClick={this.removeAllData}>Empty</a>
            <a className='button' onClick={this.addData}>Data</a>
            <a className='button' onClick={this.addLotsOfData}>Lots of Data</a>
          </h1>
          <p>Show Data</p>
          <pre>
            { pre }
          </pre>
        </div>
        <div className='column'>
          <PanelDisplayItems
            items={this.state.dataList}
            value={this.state.inputValue}
            onChangeData={e => this.handlerChangeData(e)}
            onSaveData={e => this.handlerSaveData(e)}
            onRemoveItem={this.handlerRemoveItem}
          />
        </div>
      </div>
    )
  }
}

export default DisplayItems
