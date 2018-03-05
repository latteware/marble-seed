import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import PanelDisplayData from './../../../lib/frontend/components/base-panelDisplay'

storiesOf('Panel', module)
  .add('Display Data', 
    withInfo(`
      Description and documentation
      ~~~js
      <Button>Click Here</Button>
      ~~~
    `)(() => <PanelDisplayData />))