import React from 'react'

import style from './style.scss'

export default class TemplateModule extends React.Component {
  renderRow = title => {
    return <div>{title}</div>
  }

  render() {
    return (
      <div class="content">
        {this.renderRow('Content1')}
        {this.renderRow('Content2')}
        {this.renderRow('Content3')}
        {this.renderRow('Content4')}
        {this.renderRow('Content5')}
      </div>
    )
  }
}
