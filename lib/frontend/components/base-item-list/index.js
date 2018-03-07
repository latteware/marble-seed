import React, { Component } from 'react'

class ItemList extends Component {
  render () {
    const item = this.props.items.map(i => {
      return <nav className='level' key={i.id}>
        <div className='level-left'>
          <div className='level-item'>
            <p className='subtitle is-5'>
              <strong>{i.text}</strong>
            </p>
          </div>
        </div>
        <div className='level-right'>
          <p className='level-item'>
            <button
              className='button is-danger'
              onClick={() => this.props.onRemoveItem(i.id)}
            >
              Eliminar
            </button>
          </p>
        </div>
      </nav>
    })

    return (
      <div>{item}</div>
    )
  }
}

export default ItemList
