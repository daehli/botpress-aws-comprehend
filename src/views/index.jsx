import React from 'react'
import ReactDOM from 'react-dom'
import {
  Form,
  FormGroup,
  FormControl,
  HelpBlock,
  Col,
  Button,
  ControlLabel,
  Panel,
  Checkbox,
  Radio,
  Glyphicon,
  ListGroup,
  ListGroupItem,
  InputGroup,
  Alert
} from 'react-bootstrap'

import style from './style.scss'

export default class AWSModule extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      initialStateHash: null,
      validated: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
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

  handleChange(event) {
    var { name, value } = event.target

    var connectionInputList = ['accessKeyId', 'secretAccessKey', 'region', 'apiVersion']
    if (_.includes(connectionInputList, name)) {
      this.setState({ validated: false })
    }

    this.setState({
      [name]: value
    })
  }

  handleSaveChanges() {
    this.setState({ loading: true })

    return this.getAxios()
      .post('/api/botpress-aws-comprehend/config', _.omit(this.state, 'loading', 'initialStateHash', 'validated'))
      .then(() => {
        this.setState({
          message: {
            type: 'success',
            text: 'Your configuration have been saved correctly.'
          },
          loading: false,
          initialStateHash: this.getStateHash()
        })
      })
      .catch(err => {
        this.setState({
          message: {
            type: 'danger',
            text: 'An error occured during you were trying to save configuration: ' + err.response.data.message
          },
          loading: false,
          initialStateHash: this.getStateHash()
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

  renderLabel(label, link) {
    return (
      <Col componentClass={ControlLabel} sm={3}>
        {label}{' '}
        <small>
          (<a target="_blank" href={link}>
            ?
          </a>)
        </small>
      </Col>
    )
  }

  renderTextInput(label, name, link, props = {}) {
    return (
      <FormGroup>
        {this.renderLabel(label, link)}
        <Col sm={7}>
          <FormControl name={name} {...props} type="text" value={this.state[name]} onChange={this.handleChange} />
        </Col>
      </FormGroup>
    )
  }

  renderHeader(title) {
    return (
      <div className={style.header}>
        <h4>{title}</h4>
        {this.renderSaveButton()}
      </div>
    )
  }

  renderSaveButton() {
    return (
      <Button className="bp-button" onClick={this.handleSaveChanges}>
        Save
      </Button>
    )
  }
  // ['accessKeyId', 'secretAccessKey', 'region', 'apiVersion']
  renderForm() {
    return (
      <Form horizontal>
        <div className={style.section}>
          {this.renderHeader('General')}
          {this.renderTextInput('Access Key Id', 'accessKeyId', 'aws', {
            disabled: this.state.connected
          })}{' '}
          {this.renderTextInput('Secret Access Key', 'secretAccessKey', 'aws', {
            disabled: this.state.connected
          })}{' '}
          {this.renderTextInput('Region', 'region', 'aws', {
            disabled: this.state.connected
          })}{' '}
          {this.renderTextInput('Api version', 'apiVersion', 'aws', {
            disabled: this.state.connected
          })}
        </div>
      </Form>
    )
  }

  render() {
    return <div class="content">{this.renderForm()}</div>
  }
}
