import React, { Component } from 'react'

class Footer extends Component {
  render () {
    return (<footer className='footer'>
      <div>
        <div className='has-text-centered'>
          <p>
            <strong>Marble seeds</strong> by <a href='https://commonsense.io'>Common Sense People</a>.
            The source code is licensed <a href='https://github.com/latteware/marble-seed/blob/master/LICENSE'>MIT</a>.
            The website content is licensed <a href='#'>CC ANS 4.0</a>.
          </p>
        </div>
      </div>
    </footer>)
  }
}

export default Footer
