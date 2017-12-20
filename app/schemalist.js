let
  TableList = require( './tablelist' )

let
  { entries } = Object,
  { Component } = React,
  { Accordion, Icon } = semanticUIReact

module.exports = class extends Component {

  constructor ( props ) {
    super( props )
  }

  render () {
    return <Accordion exclusive={ false } defaultActiveIndex={ [ 0 ] } panels={ [ {
      title:
        <Accordion.Title key={ `tables-title` }>
          <Icon name="dropdown" />
          <span onClick={ this.onTitleClick }>Tables</span>
        </Accordion.Title>,
      content: {
        key: 'tables',
        content:
          <Accordion.Accordion exclusive={ false } panels={
            entries( this.props.schema ).map( ( [ name, table ] ) =>
              ( {
                title:
                  <Accordion.Title key={ `table-${name}-title` }>
                    <Icon name="dropdown" />
                    <Icon name="table" />
                    <span onClick={ this.onTableTitleClick.bind( this, name ) }>{ name }</span>
                  </Accordion.Title>,
                content: {
                  key: `table-${name}-content`,
                  content: <TableList table={ table } />
                }
              } )
            )
          } />
      }
    } ] } />
  }

  onTitleClick = ev => {
    // cancel expand / collapse behavior for title clicks
    ev.stopPropagation()
  }

  onTableTitleClick = ( name, ev ) => {
    // cancel expand / collapse behavior for title clicks
    ev.stopPropagation()
    this.props.onTableTitleClick( ev, name )
  }

}
