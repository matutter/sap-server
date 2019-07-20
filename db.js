/**
 * Similar to: "https://itnext.io/graphql-mongoose-a-design-first-approach-d97b7f0c869"
 * After trying multiple implementations, listed below, it appears that the "best"
 * method of developing a GraphQL+MongoDB application is one where the schema of
 * the database is declared twice. Its declared once with the Mongoose.Schema and
 * again as `type` declarations in the GraphQL schema. What this provides is...
 * 
 * *Mongoose.Schema*
 * - Provides easy CRUD interface and additional structural checks.
 * - Pseudo relational access to object via the `populate` method.
 *   ref: "https://mongoosejs.com/docs/populate.html"
 * 
 * *GraphQL Schema*
 * - Simple declarative-first specification of types and "front facing"
 *   access to data. GraphQL takes care of all the filtering/sanitization
 *   and other monotony that REST apis.
 * - Simple declarative-first specification of queries and mutations.
 * 
 * So at the cost of declaring (most) of the data-schema twice we are left
 * with an applications which mainly exists as middleware between GraphQL
 * resolvers and Mongoose.Model API.
 */

const debug = require('debug')('sap:db')
const {
  Schema,
  Types,
  model
} = require('mongoose')

const ObjectId = Types.ObjectId
module.exports.ObjectId = ObjectId

const USERS = 'Users'
const UserSchema = new Schema({
  name: { type: String, unique:true, required: true },
})
module.exports.User = model(USERS, UserSchema)
module.exports.USERS = USERS

const RESOURCES = 'Resource'
const ResourceSchema = new Schema({
  text: String, // example "resource"
  owner: { type: ObjectId, ref: USERS }
})
module.exports.Resource = model(RESOURCES, ResourceSchema)
module.exports.RESOURCES = RESOURCES

const RESOURCELOCKS = 'ResourceLocks'
const ResourceLockSchema = new Schema({
  user: { type: ObjectId, ref: USERS, required: true },
  resource: { type: ObjectId, ref: RESOURCES, unique: true, required: true }
})
module.exports.ResourceLock = model(RESOURCELOCKS, ResourceLockSchema)
module.exports.RESOURCELOCKS = RESOURCELOCKS
