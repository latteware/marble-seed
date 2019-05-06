import React from 'react'
import PageComponent from '~base/page-component'
import { loggedIn } from '~base/middlewares/'
import UpdatePasswordForm from '~base/components/update-password'
import UpdateProfileForm from '~base/components/update-profile'
import TokensList from '~base/components/token-list'
import { FormattedMessage, injectIntl } from 'react-intl'

class Profile extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...this.baseState
    }
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    let { intl } = this.props

    return (
      <section className='section'>
        <div className='columns is-multiline'>
          <div className='column is-full is-one-third-desktop'>
            <div className='panel is-bg-white'>
              <p className='panel-heading'>
                <FormattedMessage id='general.profile' />
              </p>
              <div className='panel-block panel-body'>
                <UpdateProfileForm intl={intl} />
              </div>
            </div>
            <div className='panel is-bg-white'>
              <p className='panel-heading'>
                <FormattedMessage id='general.security' />
              </p>
              <div className='panel-block panel-body'>
                <UpdatePasswordForm />
              </div>
            </div>
          </div>
          <div className='column is-full is-two-thirds-desktop'>
            <TokensList />
          </div>
        </div>
      </section>
    )
  }
}

Profile.config({
  path: '/profile',
  title: 'Profile',
  exact: true,
  validate: loggedIn,
  component: Profile
})

export default injectIntl(Profile)
