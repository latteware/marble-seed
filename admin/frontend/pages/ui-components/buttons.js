import React from 'react'

import PageComponent from '~base/page-component'
import { loggedIn } from '~base/middlewares/'

class Buttons extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState
    }
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    return (
      <div className='button-page columns c-flex-1 is-marginless buttons-test'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Primary buttons</h1>
            <div className='buttons'>
              <h5 className='Dashboard-title'>Normal</h5>
              <a className='button button-primary is-primary'>Primary</a>
              <a className='button button-primary is-success'>Success</a>
              <a className='button button-primary is-warning'>Warning</a>
              <a className='button button-primary is-danger'>Danger</a>
              <a className='button is-disabled' >Disabled</a>
              <a className='button button-primary is-link'>Link</a>
              <a className='button button-primary is-info'>Info</a>
            </div>
            <br />
            <div className='buttons'>
              <h5 className='Dashboard-title'>Hover</h5>
              <a className='button button-primary is-primary is-hovered'>Primary</a>
              <a className='button button-primary is-success is-hovered'>Success</a>
              <a className='button button-primary is-warning is-hovered'>Warning</a>
              <a className='button button-primary is-danger is-hovered'>Danger</a>
              <a className='button is-disabled'>Disabled</a>
              <a className='button button-primary is-link is-hovered'>Link</a>
              <a className='button button-primary is-info is-hovered'>Info</a>
            </div>
            <br />
            <div className='buttons'>
              <h5 className='Dashboard-title'>Active</h5>
              <a className='button button-primary is-primary is-active'>Primary</a>
              <a className='button button-primary is-success is-active'>Success</a>
              <a className='button button-primary is-warning is-active'>Warning</a>
              <a className='button button-primary is-danger is-active'>Danger</a>
              <a className='button is-disabled'>Disabled</a>
              <a className='button button-primary is-link is-active'>Link</a>
              <a className='button button-primary is-info is-active'>Info</a>
            </div>
            <br />
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Secondary buttons</h1>
            <div className='buttons'>
              <h5 className='Dashboard-title'>Normal</h5>
              <a className='button button-secondary is-primary'>Primary</a>
              <a className='button button-secondary is-success'>Success</a>
              <a className='button button-secondary is-warning'>Warning</a>
              <a className='button button-secondary is-danger'>Danger</a>
              <a className='button is-disabled' >Disabled</a>
              <a className='button button-secondary is-link'>Link</a>
              <a className='button button-secondary is-info'>Info</a>
            </div>
            <br />
            <div className='buttons'>
              <h5 className='Dashboard-title'>Hover</h5>
              <a className='button button-secondary is-primary is-hovered'>Primary</a>
              <a className='button button-secondary is-success is-hovered'>Success</a>
              <a className='button button-secondary is-warning is-hovered'>Warning</a>
              <a className='button button-secondary is-danger is-hovered'>Danger</a>
              <a className='button is-disabled'>Disabled</a>
              <a className='button button-secondary is-link is-hovered'>Link</a>
              <a className='button button-secondary is-info is-hovered'>Info</a>
            </div>
            <br />
            <div className='buttons'>
              <h5 className='Dashboard-title'>Active</h5>
              <a className='button button-secondary is-primary is-active'>Primary</a>
              <a className='button button-secondary is-success is-active'>Success</a>
              <a className='button button-secondary is-warning is-active'>Warning</a>
              <a className='button button-secondary is-danger is-active'>Danger</a>
              <a className='button is-disabled'>Disabled</a>
              <a className='button button-secondary is-link is-active'>Link</a>
              <a className='button button-secondary is-info is-active'>Info</a>
            </div>
            <br />
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Minimalistic buttons</h1>
            <div className='buttons'>
              <h5 className='Dashboard-title'>Normal</h5>
              <a className='button button-minimalistic is-primary'>Primary</a>
              <a className='button button-minimalistic is-success'>Success</a>
              <a className='button button-minimalistic is-warning'>Warning</a>
              <a className='button button-minimalistic is-danger'>Danger</a>
              <a className='button is-disabled' >Disabled</a>
              <a className='button button-minimalistic is-link'>Link</a>
              <a className='button button-minimalistic is-info'>Info</a>
            </div>
            <br />
            <div className='buttons'>
              <h5 className='Dashboard-title'>Hover</h5>
              <a className='button button-minimalistic is-primary is-hovered'>Primary</a>
              <a className='button button-minimalistic is-success is-hovered'>Success</a>
              <a className='button button-minimalistic is-warning is-hovered'>Warning</a>
              <a className='button button-minimalistic is-danger is-hovered'>Danger</a>
              <a className='button is-disabled'>Disabled</a>
              <a className='button button-minimalistic is-link is-hovered'>Link</a>
              <a className='button button-minimalistic is-info is-hovered'>Info</a>
            </div>
            <br />
            <div className='buttons'>
              <h5 className='Dashboard-title'>Active</h5>
              <a className='button button-minimalistic is-primary is-active'>Primary</a>
              <a className='button button-minimalistic is-success is-active'>Success</a>
              <a className='button button-minimalistic is-warning is-active'>Warning</a>
              <a className='button button-minimalistic is-danger is-active'>Danger</a>
              <a className='button is-disabled'>Disabled</a>
              <a className='button button-minimalistic is-link is-active'>Link</a>
              <a className='button button-minimalistic is-info is-active'>Info</a>
            </div>
            <br />
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Icon buttons</h1>
            <p className='buttons'>
              <a className='button icon-button is-small is-link'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
                <span>Twitter</span>
              </a>
              <a className='button icon-button is-medium is-link'>
                <span>Twitter</span>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button is-medium is-link'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
                <span>Twitter</span>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
            </p>
            <br />
            <p className='buttons'>
              <a className='button icon-button button-secondary is-medium is-link'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
                <span>Secondary</span>
              </a>
              <a className='button icon-button button-minimalistic is-medium is-link'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
                <span>Minimal</span>
              </a>
            </p>
            <br />
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Button sizes</h1>
            <p className='buttons'>
              <a className='button is-link is-small'>Small</a>
              <a className='button is-link'>Normal</a>
              <a className='button is-link is-medium'>Medium</a>
              <a className='button is-link is-large'>Large</a>
              <a className='button is-link is-large is-jumbo'>Large</a>
            </p>
            <br />
            <p className='buttons'>
              <a className='button icon-button is-link is-small'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
                <span>Small</span>
              </a>
              <a className='button icon-button is-link'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
                <span>Normal</span>
              </a>
              <a className='button icon-button is-link is-medium'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
                <span>Medium</span>
              </a>
              <a className='button icon-button is-link is-large'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
                <span>Large</span>
              </a>
              <a className='button icon-button is-link is-large is-jumbo'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
                <span>Jumbo</span>
              </a>
            </p>
            <br />
            <p className='buttons'>
              <a className='button icon-button is-link is-medium is-fullwidth'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
                <span>Medium fullwidth</span>
              </a>
            </p>
            <br />
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Squared buttons</h1>
            <p className='buttons'>
              <a className='button icon-button is-link'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button is-squared button-secondary is-link is-medium'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button is-squared button-minimalistic is-link is-medium'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button is-squared is-link is-medium'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button is-squared is-link is-large'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button is-squared is-link is-jumbo'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
            </p>
            <br />
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Rounded buttons</h1>
            <p className='buttons'>
              <a className='button icon-button is-link is-rounded is-small'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button button-secondary is-link is-rounded is-medium'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button button-minimalistic is-link is-rounded is-medium'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button is-link is-rounded is-medium'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button is-link is-rounded is-large'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
              <a className='button icon-button is-link is-rounded is-jumbo'>
                <span className='icon'>
                  <i className='fa fa-cloud' />
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

Buttons.config({
  name: 'app-config',
  path: '/ui-components/buttons',
  title: 'Buttons',
  icon: 'object-group',
  // breadcrumbs: [
  //   { label: 'Dashboard', path: '/' },
  //   { label: 'Developer tools' },
  //   { label: 'App config' }
  // ],
  exact: true,
  validate: loggedIn
})

export default Buttons
