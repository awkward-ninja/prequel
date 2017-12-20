let { entries } = Object

let getColumns = async ( from, schema ) =>
  from( 'columns' )
    .where( from.raw( 'table_schema = ?', [ schema ] ) )
    .select( {
      name: 'column_name',
      type: 'data_type',
      nullable: from.raw( 'is_nullable = "YES"' ),
      defvalue: 'column_default',
      table: 'table_name'
    } )

let getKeys = async ( from, schema ) =>
  from( 'key_column_usage' )
    .where( from.raw( 'table_schema = ?', [ schema ] ) )
    .select( {
      name: 'constraint_name',
      table: 'table_name',
      column: 'column_name',
      reftable: 'referenced_table_name',
      refcolumn: 'referenced_column_name'
    } )

module.exports = {

  async getSchema ( db ) {
    // HACK: schema is assumed to be prequel_test to keep it simple for now
    let
      tables = {},
      columns = await getColumns( db, 'prequel_test' ),
      keys = await getKeys( db, 'prequel_test' )

    for ( let column of columns ) {
      let table = tables[ column.table ]
      if ( !table )
        tables[ column.table ] = table = { columns: {}, keys: {} }
      table.columns[ column.name ] = column
      delete column.name
      delete column.table
    }

    for ( let key of keys ) {
      let table = tables[ key.table ]
      if ( !table )
        tables[ key.table ] = table = { columns: {}, keys: {} }
      table.keys[ key.name ] = key
      delete key.name
      delete key.table
    }

    return tables
  },

  async setColumns ( from, table, columns ) {
    return from.schema.table( from.raw( '??', [ table ] ), t => {
      entries( columns ).map( ( [ name, column ] ) => {
        let col
        switch ( column.type ) {
          case 'int':
            col = t.integer( name ).unsigned()
            break
          case 'decimal':
            col = t.decimal( name )
            break
          default:
            col = t.string( name )
        }
        column.nullable ? col.nullable() : col.notNullable()
        column.defvalue == null || col.defaultTo( column.defvalue )
        col.alter()
      } )
    } )
  }

}
