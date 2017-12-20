let
  { entries } = Object,
  { Component } = React,
  { Accordion, Icon, List } = semanticUIReact

module.exports = class extends Component {

  render () {
    let { table } = this.props

    return <Accordion.Accordion exclusive={ false } defaultActiveIndex={ [ 0 ] } panels={ [ {
      title:
        <Accordion.Title key={ `columns-title` }>
          <Icon name="dropdown" />
          <span onClick={ this.onTitleClick }>Columns</span>
        </Accordion.Title>,
      content: {
        key: 'columns',
        content:
          <List>
            { entries( table.columns ).map( ( [ name ] ) =>
              <List.Item key={ `column-${name}-content` }>
                <List.Icon name="columns" />
                <List.Content>
                  <List.Header>{ name }</List.Header>
                </List.Content>
              </List.Item>
            ) }
          </List>
      }
    }, {
      title:
        <Accordion.Title key={ `keys-title` }>
          <Icon name="dropdown" />
          <span onClick={ this.onTitleClick }>Keys</span>
        </Accordion.Title>,
      content: {
        key: 'keys',
        content:
          <List>
            { entries( table.keys ).map( ( [ name ] ) =>
              <List.Item key={ `key-${name}-content` }>
                <List.Icon name="key" />
                <List.Content>
                  <List.Header>{ name }</List.Header>
                </List.Content>
              </List.Item>
            ) }
          </List>
      }
    } ] } />
  }

  onTitleClick = ev => {
    // cancel expand / collapse behavior for title clicks
    ev.stopPropagation()
  }

}
