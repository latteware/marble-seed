import React from 'react'

import { storiesOf } from '@storybook/react'
import PanelDisplayData from './../../../lib/frontend/components/base-panelDisplay'

storiesOf('Panel', module)
  .add('Display Data', () => <PanelDisplayData />)