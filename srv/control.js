let
  DB = require( './database' ),
  { getSources, setSources } = require( './sources' ),
  { getSchema, setColumns } = require( './schemas' )

module.exports = server => {

  [ {
    method: 'GET',
    path: '/lib/{param*}',
    handler: { directory: { path: 'node_modules' } }
  }, {
    method: 'GET',
    path: '/{param*}',
    handler: { directory: { path: 'pub' } }
  }, {
    method: 'GET',
    path: '/api/sources',
    handler: getSources
  }, {
    method: 'POST',
    path: '/api/sources',
    handler: async request => {
      try {
        let
          { name, host, user, pass } = request.payload,
          sources = await getSources()
        sources[name] = { host, user, pass }
        // TODO: the await here doesn't seem necessary but errors get thrown without it
        //       I suspect writeJson is the culprit somehow (resolves to undefined or something weird?)
        await setSources( sources )
        return null
      } catch ( error ) {
        console.error( error )
        throw error
      }
    }
  }, {
    method: 'GET',
    path: '/api/schemas/{name}',
    handler: async request => {
      try {
        return DB( request.params.name, 'information_schema', getSchema )
      } catch ( error ) {
        console.error( error )
        throw error
      }
    }
  }, {
    method: 'POST',
    path: '/api/tables/{name}/columns',
    handler: async request => {
      try {
        // HACK: source is assumed to be Lulus VM to keep it simple for now
        //       schema is assumed to be prequel_test to keep it simple for now
        await DB( 'Lulus VM', 'prequel_test', db =>
          setColumns( db, request.params.name, request.payload )
        )
        return null
      } catch ( error ) {
        console.error( error )
        throw error
      }
    }
  } ].forEach( route => {
    server.route( route )
  } )

}
