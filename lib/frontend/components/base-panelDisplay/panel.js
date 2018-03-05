import React, { Component } from 'react'


class DisplayDataList extends Component {
	render () {
		const item = this.props.items.map( i => {
			return <nav className="level" key={i.id}>
				<div className="level-left">
					<div className="level-item">
						<p className="subtitle is-5">
							<strong>{i.text}</strong> 
						</p>
					</div>
				</div>
				<div className="level-right">
					<p className="level-item">
						<button 
						className="button is-danger"
						onClick={() => this.props.onRemoveItem(i.id)}>
							Eliminar
						</button>
					</p>
				</div>
			</nav>
		})

		return (
			<div>{item}</div>
		)
	}
}

class PanelDisplayData extends Component {
	constructor () {
		super()
		this.state = {
			inputValue: '',
			dataList: []
		}

		this.handlerChangeData = this.handlerChangeData.bind(this)
		this.handlerSaveData = this.handlerSaveData.bind(this)
		this.handlerRemoveData = this.handlerRemoveData.bind(this)
	}

	handlerChangeData (event) {
		this.setState({inputValue: event.target.value})
	}

	handlerSaveData () {
		if(this.state.inputValue){
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

	handlerRemoveData (itemId) {
		const itemRemoveId = this.state.dataList.findIndex(x => x.id === itemId)
		const removeItem = this.state.dataList.splice(itemRemoveId, 1)

		this.setState({dataList: this.state.dataList})
	}

	render () {
		return(
			<div className="card">
				<header className="card-header">
					<p className="card-header-title">
						 Panel Title
					</p>
				</header>
				<div className="card-content">
					<div className="content">
						<div className="field is-grouped">
							<p className="control">
								<input 
									className="input" 
									type="text" 
									value={this.state.inputValue} 
									onChange={this.handlerChangeData}
								/>
							</p>
							<p className="control">
								<button 
									className="button is-info"
									onClick={this.handlerSaveData} >
									Add
								</button>
							</p>
						</div>
						<DisplayDataList 
							items={this.props.data}
							onRemoveItem={this.handlerRemoveData}/>
					</div>
				</div>
			</div>
		)
	}
}

export default PanelDisplayData