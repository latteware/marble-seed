import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import StorybookDisplayItems from './display-items'

storiesOf('Display Items', module)
  .add('List items with events click and submit',
    withInfo(`
      ### __Documentation for Item List__
      __EVENTS__

      \`
      onClick
      \`

      - onSaveData() 

      - onChangeData()
    
      - onRemoveItem()

      \`
      onSubmit
      \`

      - onSaveData()


      __BOTTONS__

      __Simple states__

      Empty ─> Clean the data schema

      Data ─> set items in the schema to show them in the data list

      Lots of data ─> set many items in the schema to show them in the data list


      __Panel Display__

      Add ─> Add Item on the data schema

      Delete ─> Add Item on the data schema



    `)(() => <StorybookDisplayItems />))
