import React, { Component } from 'react'
import classNames from 'classnames'

class BaseMultiFilterPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      exporting: false,
      toggled: true,
      defaultFilters: this.props.filters,
      formData: this.setFormData(),
      inputTypeSelected: null,
      inputValue: '',
      inputValues: [],
      inputType: '',
      inputPlaceHolder: '',
      inputName: '',
      tags: [],
      selectBtn: false,
      multiSelectClass: '',
      selectOptionsClass: '',
      selectBtnClass: '',
      type: '',
      field: ''
    }

    this.setFormData = this.setFormData.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.handleInputChanged = this.handleInputChanged.bind(this)
    this.handleSelectChanged = this.handleSelectChanged.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.deleteTagFromList = this.deleteTagFromList.bind(this)
    this.controlSelectBtn = this.controlSelectBtn.bind(this)
  }

  setFormData () {
    let obj = {}
    for (var item in this.props.uiSchema) {
      obj[item] = ''
    }
    return obj
  }

  onFilter (e) {
    e.preventDefault()

    const { formData } = this.state

    let filters = {}
    for (var field in formData) {
      if (formData[field]) {
        filters[field] = formData[field]
      }
    }

    console.log('formdata', formData)

    this.props.onFilter({
      ...this.state.defaultFilters,
      ...filters
    })
  }

  onChangeUiWidget (e) {
    this.setState({ inputValue: '' })
    let selectedIndex = e.target.id.split('-')[1]
    this.setInputStates(selectedIndex)
    this.selectBtnAction()
  }

  setInputStates (selectedIndex) {
    const { config } = this.props
    this.setState({
      inputName: config[selectedIndex].widget,
      inputPlaceHolder: config[selectedIndex].placeHolder,
      inputType: config[selectedIndex].type,
      inputValues: (config[selectedIndex].values) ? config[selectedIndex].values : '',
      type: selectedIndex,
      field: config[selectedIndex].field
    })
  }

  handleInputChanged (event) {
    this.setState({ inputValue: event.target.value })
  }

  handleSelectChanged (event) {
    const { formData } = this.state
    let filters = {}
    let inputValue = event.target.value
    this.setState((prevState) => {
      return { inputValue }
    }, () => {
      this.insertTags()
      for (var field in formData) {
        if (formData[field]) {
          filters[field] = formData[field]
        }
      }

      this.props.onFilter({
        ...this.state.defaultFilters,
        ...filters
      })
    })
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.insertTags()
    }
  }

  insertTags () {
    let formData = { ...this.state.formData }
    formData[this.state.field] = this.state.inputValue
    console.log('formdata', formData)
    if (this.state.tags.length === 0) {
      this.setState({
        formData,
        tags: [{ name: this.state.inputName, value: this.state.inputValue, title: this.state.inputPlaceHolder, type: this.state.type, field: this.state.field }]
      })
    } else {
      this.state.tags.map((e, i) => {
        // if tag exists
        if (e.name === this.state.inputName) {
          // replace
          this.state.tags[i].name = this.state.inputName
          this.state.tags[i].value = this.state.inputValue
          this.setState({ tags: this.state.tags })
        } else {
          // add it
          this.setState({
            formData,
            tags: this.state.tags.concat([{ name: this.state.inputName, value: this.state.inputValue, title: this.state.inputPlaceHolder, type: this.state.type, field: this.state.field }])
          })
        }
      })
    }
  }

  deleteTagFromList (e) {
    let index = e.target.id.split('-')[1]
    let array = this.state.tags
    let formData = { ...this.state.formData }

    Object.keys(formData).map((e, i) => {
      if (e === array[index].field) {
        formData[e] = ''
      }
    })

    this.setState((prevState) => {
      return { formData: formData }
    })

    if (index) {
      array.splice(index, 1)
      this.setState((prevState) => {
        return { tags: array }
      })
      let filters = {}
      for (var field in formData) {
        if (formData[field]) {
          filters[field] = formData[field]
        }
      }

      this.props.onFilter({
        ...this.state.defaultFilters,
        ...filters
      })
    }
  }

  controlSelectBtn (e) {
    // e.preventDefault()
    this.selectBtnAction()
  }
  selectBtnAction () {
    let option
    if (this.state.selectBtn) {
      option = false
    } else {
      option = true
    }
    this.setState((prevState) => {
      return { selectBtn: option }
    })
    const multiSelectClass = classNames('fa', {
      'fa-chevron-up': option,
      'fa-chevron-down': !option
    })
    const selectBtnClass = classNames('select-btn button is-link is-outlined', {
      'select-btn--collapsed': option,
      '': option
    })

    this.setState({ multiSelectClass, selectBtnClass })

    const selectOptionsClass = classNames('select-options', {
      'select-options--collapsed': this.state.selectBtn
    })
    this.setState({ multiSelectClass, selectOptionsClass })
  }

  componentDidMount () {
    const multiSelectClass = classNames('fa', {
      'fa-chevron-up': this.state.selectBtn,
      'fa-chevron-down': !this.state.selectBtn
    })
    const selectOptionsClass = classNames('select-options', {
      'select-options--collapsed': !this.state.selectBtn
    })
    const selectBtnClass = classNames('select-btn button is-link is-outlined', {
      'select-btn--collapsed': this.state.selectBtn,
      '': this.state.selectBtn
    })
    this.setState({ multiSelectClass, selectOptionsClass, selectBtnClass })
    this.setInputStates('name')
  }

  render () {
    const {config} = this.props
    let filterWidget
    if (this.state.inputName === 'SelectInput') {
      filterWidget = <select className={'input is-small '} value={this.state.inputValue} onChange={this.handleSelectChanged} placeholder={this.state.inputPlaceHolder}
      >
        {this.state.inputValues.map(item => {
          return <option key={item.value} value={item.value}> {item.label} </option>
        })}
      </select>
    } else {
      filterWidget = <input className='input is-small' name={this.state.inputName} type={this.state.inputType} value={this.state.inputValue} onChange={this.handleInputChanged} onKeyPress={this.handleKeyPress} placeholder={this.state.inputPlaceHolder} />
    }

    return (
      <div className='column is-narrow side-filters is-paddingless'>
        <div className='card full-height is-shadowless'>
          <form onSubmit={this.onFilter}>
            <div className='multifilter'>
              <button className={this.state.selectBtnClass} onClick={this.controlSelectBtn}>Filtrar{'\u00A0'}{'\u00A0'}<i className={this.state.multiSelectClass} /></button>
              <ul className={this.state.selectOptionsClass}>
                {Object.keys(config).map((e, i) => {
                  return <li key={i} id={'option-' + e} onClick={this.onChangeUiWidget.bind(this)}>
                    {config[e].label}<span id={'optionspan-' + i}>{this.state.formData[config[e].field]}</span>
                  </li>
                })}
              </ul>
              <div className='panel-block'>
                <div className='field'>
                  <p className='control has-icons-left'>
                    {filterWidget}
                    <span className='icon is-small is-left'>
                      <i className='fa fa-search' />
                    </span>
                  </p>
                </div>
              </div>
              <ul className='tags'>
                {this.state.tags.map((e, i) => {
                  return <li key={i} id={'tag-' + i} className='tag' onClick={this.deleteTagFromList}>{e.value}<span id={'span-' + i} onClick={this.deleteTagFromList} className='close-tag'><i className='fa fa-times' /></span></li>
                })}
              </ul>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default BaseMultiFilterPanel
