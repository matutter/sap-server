const request = require('request')
const { start_server } = require('../index')
const { User, Resource } = require('../db')

module.exports.post = function(url, q) {
  return new Promise((res, rej) => {
    request.post(url, { json: { query: q } }, (e, r, body) => {
      if (e) return rej(e)
      res(body)
    })
  }) 
}

module.exports.start_server = async function() {
  let options = {
    db_uri: 'mongodb://localhost:27017/sap_TEST',
    db: { useNewUrlParser: true },
    port: 0
  }
  let app = await start_server(options)
  let timeout = setTimeout(() => {
    console.error(`Server on port ${app.port} TTL expired.`)
    app.server.close()
  }, 10 * 1000);
  app.server.on('close', () => {
    clearTimeout(timeout)
  })
  return app
}

module.exports.clear_database = async function() {
  await Promise.all([
    User.deleteMany({}),
    Resource.deleteMany({})
  ])
}

module.exports.setup = function(test) {
  let setup = async function () {
    test.app = await module.exports.start_server()
    if ( test.app.port === undefined ) throw Error(`Server has no port assignment`)
    test.url = `http://localhost:${test.app.port}/gql`
    await module.exports.clear_database()
  }
  return setup
}

module.exports.teardown = function (test) {
  let teardown = async function () {
    test.app.server.close()
    await module.exports.clear_database()
  }
  return teardown
}