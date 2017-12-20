let { getSources } = require( './sources' )

let
  { notFound } = require( 'boom' ),
  knex = require( 'knex' )

module.exports = async ( srcname, schema, query ) => {

  let db

  try {
    let source = ( await getSources() )[ srcname ]

    if ( !source )
      throw notFound()

    db = knex( {
      client: 'mysql2',
      connection: {
        host: source.host,
        user: source.user,
        password: source.pass,
        database: schema
      }
    } )

    // TODO: the await here doesn't seem necessary but errors get thrown without it
    //       I suspect getSchema is the culprit somehow
    return await query( db )
  } catch ( error ) {
    console.error( error )
    throw error
  } finally {
    // TODO: should figure out how to properly interact with connection pooling
    if ( db )
      db.destroy()
  }

}
