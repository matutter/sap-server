const debug = require('debug')('test')
const chai = require('chai')
const expect = chai.expect
const {
  post,
  start_server,
  clear_database,
  setup,
  teardown
} = require('./fixtures')
const {
  User,
  Resource,
  ObjectId
} = require('../db')

describe('User queries and mutations', async function() {
  let test = {}
  let user_name = 'testuser'
  let user_id = null

  before(setup(test))

  describe('addUser', () => {
    let addUser = `
      mutation {
        addUser(name: "${user_name}") {
          _id
          name
        }
      }`

    it('should add a new user', async function() {
      let res = await post(test.url, addUser)
      expect(res).to.deep.nested.include({'data.addUser.name': user_name})
      user_id = res.data.addUser._id
    })
  
    it('should not create duplicate users', async function() {
      let res = await post(test.url, addUser)
      expect(res).to.deep.nested.include({'data.addUser': null})
    })
  })

  describe('findUser(s)', () => {
    it('should find a user by name', async function() {
      let res = await post(test.url, `
        query {
          findUser(name: "${user_name}") {
            _id
            name
          }
        }`)
      expect(res).to.deep.nested.include({
        'data.findUser.name': user_name,
        'data.findUser._id': user_id
      })
    })

    it('should find a user by _id', async function () {
      let res = await post(test.url, `
        query {
          findUser(_id: "${user_id}") {
            _id
            name
          }
        }`)
      expect(res).to.deep.nested.include({
        'data.findUser.name': user_name,
        'data.findUser._id': user_id
      })
    })
  })

  after(teardown(test))
})

describe('Resource queries and mutations', function () {
  let user_name = 'testuser2'
  let resource_text = 'my resource data'
  let test = {}
  let resource_id = null
  let user_id = null

  before(async function() {
    await setup(test)()
    let user = await new User({ name: user_name }).save()
    user_id = user._id.toString()
  })

  describe('addResource', () => {
    it('should create a document', async function () {
      let res = await post(test.url, `
        mutation {
          addResource(text: "${resource_text}") {
            _id
            text
          }
        }`)
      expect(res).to.deep.nested.include({
        'data.addResource.text': resource_text
      })
      
      resource_id = res.data.addResource._id
    })
  })

  describe('setResourceOwner', () => {
    it('should set the owner of a Resource', async function() {
      let res = await post(test.url, `
        mutation {
          setResourceOwner(user: "${user_id}", resource: "${resource_id}")
        }`)

      expect(res.data.setResourceOwner).to.be.true

      let resource = await Resource.findById(resource_id).populate('owner')
      expect(resource).to.deep.nested.include({
        'text': resource_text,
        'owner.name': user_name,
        'owner._id': ObjectId(user_id) // because its directly from mongoose Document
      })
    })
  })

  describe('findResource', () => {
    // TODO: or text
    it('should find a Resource by _id', async function () {
      let res = await post(test.url, `
        query {
          findResource(_id: "${resource_id}") {
            _id
            text
          }
        }`)
      expect(res).to.deep.nested.include({
        'data.findResource.text': resource_text,
        'data.findResource._id': resource_id
      })
    })
  })

  after(teardown(test))
})
