process.env.DEBUG = 'sap*'
const debug = require('debug')('sap')
const app = require('express')()
const mongoose = require('mongoose')
const package = require('./package.json')

const mongouri = 'mongodb://localhost:27017/sap'

app.use((req, res, next) => {
  debug(`new request ${req.url}`)
  next()
})

async function server_start() {

  app.db = await mongoose
    .connect(mongouri, package.db_options)

  app.use('/gql', require('./graph')(app))

  await app.listen(4000)
}  

server_start().then(() => {
  debug("server online")
}).catch(debug)


