const debug = require('debug')('sap')
const app = require('express')()
const mongoose = require('mongoose')

app.use((req, res, next) => {
  debug(`new request ${req.url}`)
  next()
})

async function start_server(opts) {
  app.db = await mongoose.connect(opts.db_uri, opts.db)
  app.use('/gql', require('./graph')(app))
  app.server = await app.listen(opts.port)
  app.port = app.server.address().port
  return app
}
module.exports.start_server = start_server

if ( require.main == module ) {
  process.env.DEBUG = 'sap*'
  let options = {
    db_uri: 'mongodb://localhost:27017/sap',
    db: { useNewUrlParser: true },
    port: 4000
  }
  start_server(options).then((app) => {
    debug(`Listening on port ${app.port}`)
  }).catch(debug)
}
