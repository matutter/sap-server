const debug = require('debug')('sap:query')

async function resources(query) {
  debug(`searching resources:`, query)
  let res = await this.db.resources.find(query).toArray()
  return res
}

async function resource(query) {
  debug(`searching resource:`, query)
  return await this.db.resources.findOne(query)
}

async function createResource(query, req, res) {
  const insert = await this.db.resources.insertOne(query)
  if (insert.insertedCount > 0) return insert.ops[0]
  return null
}

module.exports = function(app) {
  const graphql_middleware = require('express-graphql')
  const buildSchema = require('graphql').buildSchema
  const fs = require('fs')
  return graphql_middleware({
    schema: buildSchema(fs.readFileSync('schema.gql', 'utf8')),
    graphiql: true,
    rootValue: {
      resources: resources.bind(app),
      resource: resource.bind(app),
      createResource: createResource.bind(app)
    }
  })
}
