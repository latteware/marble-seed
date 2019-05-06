import React from 'react'

import { storiesOf } from '@storybook/react'
import { SimpleTable, TableHead, TableBody, BaseTable } from './../../../lib/frontend/components/base-table'

let columns = [{
  'title': 'Days',
  'property': '_id',
  'default': 'N/A',
  'totals': false
}, {
  'title': 'Leads',
  'property': 'leads',
  'default': 'N/A',
  'totals': true
}]

let tableData = [{
  _id: '2017-10-12T16:23:28.911Z',
  leads: 45,
  isDeleted: false,
  name: 'elRic ',
  slug: 'elric'
}]

storiesOf('Table', module)
  .add('Simple table', () => <SimpleTable
    className='table is-bordered is-striped is-hoverable is-fullwidth has-text-centered is-marginless'
    columns={columns}
    data={tableData}>
    <TableHead columns={columns} />
    <TableBody data={tableData} columns={columns} />
  </SimpleTable>)

storiesOf('Table', module)
  .add('Table with totals', () => <BaseTable
    className='table is-bordered is-striped is-hoverable is-fullwidth has-text-centered is-marginless'
    columns={columns}
    data={tableData}>
    <TableHead columns={columns} />
    <TableBody data={tableData} columns={columns} />
  </BaseTable>)
