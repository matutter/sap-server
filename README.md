**WIP**

```gql
# Get many
query {
  resources(owner:"bob") {
    _id
    owner
  }
}

# Get one
query {
  resource(_id:"5d2fe1bebedc8f4219617269") {
    _id
    owner
  }
}

# Create one
mutation {
  createResource(owner:"bob") {
    _id
    owner
  }
}

mutation {
  createDoc(text: "Hello world!") {
    _id
    text
  }
}

mutation {
  createResource(ref: "5d312c408d8ee556a6ee5ac1", owner: "mat") {
    _id
    owner
    ref
    doc {
      text
      _id
    }
  }
}


```