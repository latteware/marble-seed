import React from 'react'
import PageComponent from '~base/page-component'
import { FormattedMessage, injectIntl } from 'react-intl'

import { forcePublic } from '~base/middlewares/'

class Home extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...this.baseState,
      name: 'Eric',
      unreadCount: 1000,
    }
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    const { name, unreadCount } = this.state
    const { formatMessage } = this.props.intl

    return (
      <section className='home hero is-info bsa'>
        <div className='container'>
          <div className='columns is-vcentered'>
            <div className='column is-4'>
              <p className='title'>
                <FormattedMessage id="general.home" />
              </p>
              <p className='subtitle'>
                <FormattedMessage id='general.marbleseeds'/>
              </p>
              <p className='subtitle'>
                <FormattedMessage
                  id="general.regards"
                  values={{ name: <b>{name}</b> }}
                />
              </p>
              <p>
                <FormattedMessage id="general.welcome" />
              </p>

            </div>

            <div className='column is-8'>
              <div className='bsa-cpc' />
            </div>

          </div>
        </div>
      </section>
    )
  }
}

Home.config({
  path: '/',
  title: 'Home',
  validate: forcePublic,
  exact: true
})

export default injectIntl(Home)
