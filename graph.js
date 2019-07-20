const debug = require('debug')('sap:query')
const {
  User, USERS,
  Resource,
  ResourceLock,
  ObjectId
} = require('./db')

async function findResources(query) {
  debug(`findResources`, query)
  let docs = await Resource.find(query).populate('owner')
  return docs
}

async function findResourcesByUser(query) {
  debug(`findResourcesByUser`, query)
  return findResources({ owner: ObjectId(query._id) })
}

async function findResource(query) {
  debug(`Find Resource:`, query)
  return await Resource.findOne(query).populate('owner')
}

async function addResource(query, req, res) {
  debug("New Resource:", query)
  const doc = new Resource(query)
  await doc.save()
  return doc
}

async function setResourceOwner(q, req, res) {
  let lock = new ResourceLock(q)
  await lock.save()
  try {
    await Resource.findByIdAndUpdate(q.resource, { owner: q.user })
  } catch(e) {
    await ResourceLock.findByIdAndDelete(lock._id)
    throw e
  }
  return true
}

async function removeResourceOwner(q, req, res) {
  let op = await ResourceLock.findOneAndDelete({ resource: q._id })
  if ( op )
    await Resource.findByIdAndUpdate(q._id, { $unset: { owner: true } })
  return op != null
}

async function findUser(query) {
  debug(`Find User:`, query)
  return await User.findOne(query)
}

async function findUsers(query) {
  debug(`Find Users:`, query)
  return await User.find(query)
}

async function addUser(query, req, res) {
  const doc = new User(query)
  await doc.save()
  return doc
}

module.exports = function(app) {
  const graphql_middleware = require('express-graphql')
  const { buildSchema } = require('graphql')
  const { readFileSync } = require('fs')
  return graphql_middleware({
    schema: buildSchema(readFileSync('schema.gql', 'utf8')),
    graphiql: true,
    rootValue: {
      // docs
      findUser: findUser.bind(app),
      findUsers: findUsers.bind(app),
      addUser: addUser.bind(app),
      // resources
      findResource: findResource.bind(app),
      findResources: findResources.bind(app),
      findResourcesByUser: findResourcesByUser.bind(app),
      addResource: addResource.bind(app),
      setResourceOwner: setResourceOwner.bind(app),
      removeResourceOwner: removeResourceOwner.bind(app)
    }
  })
}
