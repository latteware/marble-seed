import React, { Component } from 'react'
import MarbleForm from '~base/components/marble-form'
import FontAwesome from 'react-fontawesome'
import BaseModal from '~base/components/base-modal'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove
} from 'react-sortable-hoc'

const baseSchema = {
  widget: {
    label: 'Widget',
    type: 'string',
    options: [
      'TextWidget',
      'TextareaWidget',
      'PasswordWidget',
      'EmailWidget',
      'NumberWidget',
      'HiddenWidget',
      'SelectWidget',
      'MultipleSelectWidget',
      'DateWidget',
      'DateTimeWidget',
      'TimeWidget',
      'CheckboxWidget',
      'FileWidget',
      'RadioWidget'
    ],
    placeholder: 'Select a widget',
    widget: 'SelectWidget',
    required: true
  },
  name: {
    label: 'name',
    type: 'string',
    placeholder: 'Name',
    widget: 'TextWidget',
    required: true
  },
  label: {
    label: 'label',
    type: 'string',
    placeholder: 'Add label',
    widget: 'TextWidget',
    required: true
  },
  placeholder: {
    label: 'Placeholder',
    type: 'string',
    widget: 'TextWidget'
  },
  tooltip: {
    label: 'Tooltip',
    type: 'string',
    widget: 'TextWidget'
  },
  className: {
    label: 'Class name',
    type: 'string'
  },
  default: {
    label: 'default',
    type: 'string'
  },
  required: {
    label: 'Required?',
    type: 'boolean',
    widget: 'CheckboxWidget'
  },
  disabled: {
    label: 'Disabled?',
    type: 'boolean',
    widget: 'CheckboxWidget'
  }
}

const WidgetSchemas = {
  TextareaWidget: {
    default: {
      label: 'default',
      type: 'string',
      widget: 'TextareaWidget'
    }
  },
  EmailWidget: {
    default: {
      label: 'default',
      type: 'string',
      widget: 'EmailWidget'
    }
  },
  HiddenWidget: {
    label: {
      widget: 'HiddenWidget'
    },
    placeholder: {
      widget: 'HiddenWidget'
    },
    className: {
      widget: 'HiddenWidget'
    },
    default: {
      label: 'default',
      type: 'string',
      required: true
    },
    required: {
      widget: 'HiddenWidget'
    },
    disabled: {
      widget: 'HiddenWidget'
    }
  },
  NumberWidget: {
    default: {
      label: 'default',
      type: 'number',
      widget: 'NumberWidget'
    },
    type: {
      name: 'type',
      default: 'number',
      widget: 'HiddenWidget'
    },
    minimum: {
      name: 'minimum',
      label: 'Minimum',
      type: 'number',
      placeholder: 'Select minimum',
      widget: 'NumberWidget'
    },
    maximum: {
      name: 'maximum',
      label: 'Maximum',
      type: 'number',
      placeholder: 'Select maximum',
      widget: 'NumberWidget'
    },
    step: {
      name: 'step',
      label: 'Step',
      type: 'number',
      placeholder: 'Select step size',
      widget: 'NumberWidget'
    }
  },
  SelectWidget: {
    default: {
      label: 'default',
      type: 'string'
    },
    allowEmpty: {
      label: 'allowEmpty?',
      type: 'boolean',
      widget: 'CheckboxWidget'
    },
    options: {
      name: 'options',
      placeholder: 'Select options',
      widget: 'MultipleSelectWidget',
      addable: true
    }
  },
  MultipleSelectWidget: {
    default: {
      label: 'default',
      type: 'string'
    },
    options: {
      name: 'Options',
      placeholder: 'Select options',
      widget: 'MultipleSelectWidget',
      addable: true
    },
    addable: {
      label: 'Addable?',
      widget: 'CheckboxWidget'
    }
  },
  DateWidget: {
    default: {
      label: 'default',
      type: 'date',
      widget: 'DateWidget'
    }
  },
  DateTimeWidget: {
    default: {
      label: 'default',
      type: 'date',
      widget: 'DateTimeWidget'
    }
  },
  TimeWidget: {
    default: {
      label: 'default',
      type: 'date',
      widget: 'TimeWidget',
      timeIntervals: 5
    }
  },
  CheckboxWidget: {
    default: {
      label: 'default',
      type: 'boolean',
      widget: 'CheckboxWidget'
    }
  },
  FileWidget: {
    placeholder: {
      widget: 'HiddenWidget'
    },
    className: {
      widget: 'HiddenWidget'
    },
    tooltip: {
      widget: 'HiddenWidget'
    },
    default: {
      widget: 'HiddenWidget'
    },
    required: {
      widget: 'HiddenWidget'
    },
    disabled: {
      widget: 'HiddenWidget'
    },
    type: {
      widget: 'SelectWidget',
      name: 'output',
      label: 'Output',
      required: true,
      default: 'base64',
      options: [
        { label: 'base64', value: 'base64' },
        { label: 'image', value: 'image' },
        { label: 'json', value: 'json' },
        { label: 'text', value: 'text' },
        { label: 'csv', value: 'csv' }
      ]
    },
    size: {
      label: 'Max size(in mbs)',
      widget: 'NumberWidget',
      type: Number
    }
  },
  RadioWidget: {
    default: {
      label: 'Default',
      type: 'string',
      widget: 'TextWidget'
    },
    options: {
      label: 'Options',
      placeholder: 'Select options',
      widget: 'MultipleSelectWidget',
      addable: true
    },
    placeholder: {
      widget: 'HiddenWidget'
    }
  }
}

const SortableItem = SortableElement(props => {
  const DragHandle = SortableHandle(() => {
    return (<div className='card-header-title is-flex'>
      <div className='is-fullwidth'>
        {props.item.name} {props.item.required ? '*' : ''}
      </div>
      <div className='is-fullwidth has-text-weight-normal has-text-right'>
        <small>{props.item.widget}</small>
      </div>
    </div>)
  })

  return <div className='card'>
    <div className='card-header'>
      <DragHandle />
      <div className='card-header-icon'>
        <a className='icon' onClick={() => props.showModal(props.widgetIndex)}>
          <i className='fa fa-edit' />
        </a>
        <a className='icon' onClick={() => props.removeWidget(props.widgetIndex)}>
          <i className='fa fa-trash' />
        </a>
      </div>
    </div>
  </div>
})

const SortableList = SortableContainer(props => {
  return (
    <div>
      {props.items.map((item, index) => {
        return <SortableItem
          key={`item-${index}`}
          item={item}
          index={index}
          widgetIndex={index}
          showModal={d => props.showModal(d)}
          removeWidget={d => props.removeWidget(d)}
        />
      })}
    </div>
  )
})

class FormWidget extends Component {
  constructor (props) {
    super(props)
    const initialData = props.initialData || {}
    const formData = props.formData || {}

    this.state = {
      initialData,
      formData,
      currentWidget: props.currentWidget,
      widgetSchema: WidgetSchemas[initialData.widget] || {}
    }
  }

  componentWillReceiveProps (props) {
    const initialData = 'initialData' in props ? props.initialData : this.props.initialData
    const formData = 'formData' in props ? props.formData : this.props.FormBuilder

    this.setState({
      initialData,
      formData,
      currentWidget: props.currentWidget,
      widgetSchema: WidgetSchemas[initialData.widget] || {}
    })
  }

  onChange (data, index) {
    const state = {formData: data}

    state.widgetSchema = WidgetSchemas[data.widget] || {}
    this.setState(state)
  }

  async onSubmit (data, index) {
    await this.props.onSubmit(data, index)
    this.clearState()
  }

  clearState () {
    this.setState({
      initialData: this.props.initialData
    })
  }

  render () {
    const schema = {...baseSchema}

    Object.keys(this.state.widgetSchema).map(key => {
      schema[key] = this.state.widgetSchema[key]
    })

    return <MarbleForm
      schema={schema}
      initialData={this.state.initialData}
      formData={this.state.formData}
      onChange={data => this.onChange(data)}
      onSubmit={data => this.onSubmit(data, this.state.currentWidget)}
      successMessage=''
      errorMessage=''
    />
  }
}

class FormBuilder extends Component {
  constructor (props) {
    super(props)
    const initialSchema = props.initialSchema || {}
    this.state = {
      schema: initialSchema,
      currentWidget: -1,
      classNameModal: ''
    }

    this.state.widgets = Object.keys(initialSchema).map(key => {
      const item = initialSchema[key]
      item.id = key
      item.name = item.name || key
      item.widget = item.widget || 'TextWidget'

      return item
    })
  }

  showModal (index) {
    this.setState({
      currentWidget: index,
      classNameModal: 'is-active'
    })
  }

  hideModal () {
    this.setState({
      currentWidget: -1,
      classNameModal: ''
    })
  }

  removeWidget (index) {
    let { widgets } = this.state
    delete widgets[index]
    this.setState({ widgets })
    this.onChange()
  }

  onSubmitWidget (data, index) {
    let { widgets } = this.state

    if (index > -1) {
      widgets[index] = data
    } else {
      widgets.push(data)
    }

    this.setState({ widgets })
    this.hideModal()
    this.onChange()
  }

  onSortEnd ({oldIndex, newIndex}) {
    this.setState({
      widgets: arrayMove(this.state.widgets, oldIndex, newIndex)
    })
    this.onChange()
  }

  onChange () {
    if (this.props.onChange) {
      const { widgets } = this.state
      const schema = {}
      widgets.forEach(widget => {
        schema[widget.name] = widget
      })
      this.props.onChange(schema)
    }
  }

  render () {
    const { widgets, currentWidget } = this.state

    let initialData = {}
    let formData = {}
    if (currentWidget > -1) {
      initialData = widgets[currentWidget]
      formData = widgets[currentWidget]
    }

    const currentWidgetForm = <FormWidget
      currentWidget={currentWidget}
      initialData={initialData}
      formData={formData}
      onSubmit={(data, index) => this.onSubmitWidget(data, index)}
    />

    return <div>
      <div className='is-padding-bottom-small has-text-right'>
        <a
          className='button is-small is-primary'
          onClick={() => this.showModal(-1)}
          style={{
            height: 32,
            width: 32,
            borderRadius: '100%'
          }}
        >
          <FontAwesome name='plus' />
        </a>
      </div>

      <SortableList
        items={widgets}
        onSortEnd={d => this.onSortEnd(d)}
        showModal={d => this.showModal(d)}
        removeWidget={d => this.removeWidget(d)}
        useDragHandle
      />

      <BaseModal
        title={currentWidget < 0 ? 'Add Widget' : 'Edit Widget'}
        className={this.state.classNameModal}
        hideModal={() => this.hideModal()}
      >
        {currentWidgetForm}
      </BaseModal>
    </div>
  }
}

export default FormBuilder
