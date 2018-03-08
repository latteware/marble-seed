import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import StorybookDisplayItems from './display-items'

storiesOf('Display Items', module)
  .add('List items with events click and submit',
    withInfo(`
      ### __Documentation for Item List__
      __EVENTS__

      \`\`\`
      onClick
      \`\`\`

      - onSaveData()

      - onChangeData()
    
      - onRemoveItem()
      \`\`\`
      onSubmit
      \`\`\`

      - onSaveData()

    `)(() => <StorybookDisplayItems />))
