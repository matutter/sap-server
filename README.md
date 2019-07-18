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

```