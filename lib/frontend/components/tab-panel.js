// import { TabPanel } from '~base/components/tab-panel'
// const tabs = [
//    {name: 'map', component: map, label: 'Maph'},
//    {name: 'reports', component: reports, label: 'Reports'}
//  ]
// <TabPanel tabs={tabs} />

import React, { Component } from 'react'
import _ from 'lodash'

class TabPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTab: this.props.tabs[0].name || ''
    }
    console.log(this.props.tabs[0])
  }

  render () {
    const optionsTabs = _.map(this.props.tabs, tab => {
      return (
        <li key={tab.name} onClick={e => this.setState({ currentTab: tab.name })} className={'' + (this.state.currentTab === tab.name ? 'is-active' : '')}>
          <a>
            <span className='icon is-small' />
            <span>{tab.label}</span>
          </a>
        </li>
      )
    })

    const contentTabs = _.map(this.props.tabs, tab => {
      if (this.state.currentTab === tab.name) {
        return (
          <div key={tab.name}>
            {tab.component}
          </div>
        )
      }
    })

    return (
      <div>
        <div className='tabs is-toggle is-fullwidth'>
          <ul>
            {optionsTabs}
          </ul>
        </div>
        <div>
          {contentTabs}
        </div>
      </div>
    )
  }
}

export { TabPanel }
