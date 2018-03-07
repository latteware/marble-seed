import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import StorybookDisplayItems from './display-items'

storiesOf('Display Items', module)
  .add('Default',
    withInfo(`
      Description and documentation
      ~~~js
      <Button>Click Here</Button>
      ~~~
    `)(() => <StorybookDisplayItems />))
