let
  { post } = axios,
  { Component } = React,
  { Form, Icon } = semanticUIReact

module.exports = class extends Component {

  constructor ( props ) {
    super( props )
    this.state = props.source
  }

  componentWillReceiveProps ( props ) {
    this.setState( props.source )
  }

  render () {
    let { state } = this

    return <Form size="small">
      <Form.Input name="name" label="Name" placeholder="Friendly name" width={ 6 } value={ state.name } onChange={ this.onChange } />
      <Form.Input name="host" label="Host" placeholder="Server hostname" width={ 6 } value={ state.host } onChange={ this.onChange } />
      <Form.Input name="user" label="User" placeholder="Your username" width={ 6 } value={ state.user } onChange={ this.onChange } />
      <Form.Input type="password" name="pass" label="Pass" placeholder="Your password" width={ 6 } value={ state.pass } onChange={ this.onChange } />
      <Form.Group>
        <Form.Button onClick={ this.onSaveClick }><Icon name="save" />Save</Form.Button>
        <Form.Button onClick={ this.props.onConnectClick }>Connect<Icon name="arrow circle right" /></Form.Button>
      </Form.Group>
    </Form>
  }

  onChange = ( ev, { name, value } ) => {
    this.setState( { [name]: value } )
  }

  onSaveClick = () => {
    post( '/api/sources', this.state )
  }

}
