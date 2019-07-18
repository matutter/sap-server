process.env.DEBUG = 'sap*'
const debug = require('debug')('sap')
const app = require('express')()

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectId

const mongouri = 'mongodb://localhost:27017/sap'

app.use((req, res, next) => {
  debug(`new request ${req.url}`)
  next()
})

app.use('/gql', require('./graph')(app))

async function server_start() {

  const connection = await MongoClient.connect(mongouri, {
    useNewUrlParser: true
  })
  const db = connection.db('v1')

  app.db = {
    connection: db,
    resources: db.collection('resources'),
    docs: db.collection('docs')
  }

  await app.listen(4000)

}  

server_start().then(() => {
  debug("server online")
}).catch(debug)


