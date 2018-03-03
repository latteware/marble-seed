import React, { Component } from 'react'


class DisplayDataList extends Component {
	render () {
		return (
			<nav class="level">
				<div class="level-left">
					<div class="level-item">
						<p class="subtitle is-5">
							<strong>texto</strong> 
						</p>
					</div>
				</div>
				<div class="level-right">
					<p class="level-item"><a class="button is-success">botón</a></p>
				</div>
			</nav>
		)
	}
}

class PanelDisplayData extends Component {
	render () {
		return(
			<div class="card">
				<header class="card-header">
					<p class="card-header-title">
						Title Panel
					</p>
				</header>
				<div class="card-content">
					<div class="content">
						<div class="field is-grouped">
							<p class="control">
								<input class="input" type="text" placeholder="Find a repository" />
							</p>
							<p class="control">
								<a class="button is-info">
									Search
								</a>
							</p>
						</div>
						<DisplayDataList/>
					</div>
				</div>
			</div>
		)
	}
}

export default PanelDisplayData