let
  { entries } = Object,
  { post } = axios,
  { Component } = React,
  { Form, Icon, Table } = semanticUIReact

module.exports = class extends Component {

  constructor ( props ) {
    super( props )
    this.state = {}
  }

  render () {
    return <Form size="small">
      <Table celled selectable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Null?</Table.HeaderCell>
            <Table.HeaderCell>Default</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { entries( this.props.table.columns ).map( ( [ name, { type, nullable, defvalue } ] ) =>
            <Table.Row key={ name }>
              <Table.Cell>
                <Form.Input name={ `name:${name}` } value={ name } />
              </Table.Cell>
              <Table.Cell><Form.Select name={ `type:${name}` } value={ type }
                options={ [ 'int', 'decimal', 'varchar' ].map( type =>
                  ( { text: type, value: type } )
                ) } onChange={ this.onChange } />
              </Table.Cell>
              <Table.Cell textAlign="center">
                <Form.Checkbox name={ `nullable:${name}` } checked={ nullable != 0 } onChange={ this.onChange } />
              </Table.Cell>
              <Table.Cell>
                <Form.Dropdown name={ `defvalue:${name}` } search selection allowAdditions text={ defvalue } value={ defvalue == null ? '!@#NONE#@!' : defvalue }
                  options={ [
                    // HACK: use magic value for null since null itself cannot be used in the dropdown options
                    { text: 'none', value: '!@#NONE#@!' }
                  ] } onChange={ this.onChange } />
              </Table.Cell>
            </Table.Row>
          ) }
        </Table.Body>
      </Table>
      <Form.Group>
        <Form.Button onClick={ this.onSaveClick }><Icon name="save" />Save</Form.Button>
      </Form.Group>
    </Form>
  }

  onChange = ( ev, { name, value, checked } ) => {
    let [ prop, col ] = name.split( ':', 2 )

    // TODO: no renaming columns yet
    if ( prop === 'name' )
      return

    switch ( value ) {
      case undefined:
        value = +checked
        break
      case '!@#NONE#@!':
        value = null
        break
    }

    let column = this.props.table.columns[ col ]
    column[ prop ] = value
    this.setState( { [col]: column } )
  }

  onSaveClick = async () => {
    let { status } = await post( `/api/tables/${this.props.table.name}/columns`, this.state )
    if ( status == 200 ) {
      let next = {}
      for ( let col in this.state ) {
        next[ col ] = undefined
      }
      this.setState( next )
    }
  }

}
