let control = require( './srv/control' )

let
  Hapi = require( 'hapi' ),
  Inert = require( 'inert' )

let server = Hapi.server( {
  host: 'localhost',
  port: 8080
} )

async function start () {
  await server.register( Inert )
  control( server )
  await server.start()
  console.log( `Prequel running at ${server.info.uri}` )
}

start()
