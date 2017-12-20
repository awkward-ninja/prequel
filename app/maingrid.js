let
  SourceForm = require( './sourceform' ),
  SchemaList = require( './schemalist' ),
  TableForm = require( './tableform' )

let
  { entries } = Object,
  { get } = axios,
  { Component } = React,
  { Dropdown, Grid, Icon, Menu } = semanticUIReact

module.exports = class extends Component {

  constructor ( props ) {
    super( props )

    this.state = {
      sources: {},
      current: {
        source: null,
        schema: null,
        table: null
      }
    }
  }

  render () {
    let
      { state } = this,
      { current } = state

    return <div>
      <Menu inverted className="fixed">
        <Menu.Item name="Prequel" />
        <Dropdown item trigger={ <span><Icon name="database" />Sources</span> } onOpen={ this.onSourcesOpen }>
          <Dropdown.Menu>
            <Dropdown.Item text="New Source" icon="add circle" onClick={ this.onNewSourceClick } />
            <Dropdown.Divider />
            { entries( state.sources ).map( ( [ name ] ) =>
              <Dropdown.Item key={ name } text={ name } icon="" onClick={ this.onSourceClick } />
            ) }
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            <Grid>
              <Grid.Row>
                <Grid.Column width={ 3 }>
                  { current.schema && <SchemaList schema={ current.schema } onTableTitleClick={ this.onTableTitleClick } /> }
                </Grid.Column>
                <Grid.Column width={ 13 }>
                  { current.source && <SourceForm source={ current.source } onConnectClick= { this.onConnectClick } /> }
                  { current.table && <TableForm table={ current.table } /> }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  }

  onSourcesOpen = async () => {
    let { data } = await get( '/api/sources' )
    this.setState( { sources: data } )
  }

  onNewSourceClick = () => {
    this.setState( {
      current: {
        source: {
          name: '', host: '',
          user: '', pass: ''
        }
      }
    } )
  }

  onSourceClick = ( ev, { text } ) => {
    this.setState( prev => {
      let source = prev.sources[ text ]
      source.name = text
      return { current: { source } }
    } )
  }

  onConnectClick = async () => {
    let { data } = await get( `/api/schemas/${this.state.current.source.name}` )
    this.setState( { current: { schema: data } } )
  }

  onTableTitleClick = ( ev, name ) => {
    this.setState( prev => {
      let
        { schema } = prev.current,
        table = schema[ name ]
      table.name = name
      return { current: { schema, table } }
    } )
  }

}
