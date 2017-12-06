import React from 'react'

import style from './style.scss'

export default class AWSModule extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      initialStateHash: null
    }
  }

  getAxios() {
    return this.props.bp.axios
  }

  componentDidMount() {
    this.getAxios()
      .get('/api/botpress-aws-comprehend/config')
      .then(res => {
        this.setState({
          loading: false,
          ...res.data
        })

        setImmediate(() => {
          this.setState({
            initialStateHash: this.getStateHash()
          })
        })
      })
  }

  getStateHash() {
    const hashingStateItems = ['accessKeyId', 'secretAccessKey', 'region', 'apiVersion']

    return hashingStateItems
      .map(i => {
        return this.state[i]
      })
      .join(' ')
  }

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
