let { ensureDir, readJson, writeJson } = require( 'fs-extra' )

module.exports = {

  async getSources () {
    try {
      return readJson( 'cfg/sources.json' )
    } catch ( x ) {
      if( x.code === 'ENOENT' )
        return {}
      throw x
    }
  },

  async setSources ( val ) {
    await ensureDir( 'cfg' )
    return writeJson( 'cfg/sources.json', val, { spaces: 2 } )
  }

}
