export const schema = `
  type Deal {
    id: String!
    name: String!
    description: String!
    address: String!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    deals: [Deal!]!
  }

  input CreateDealInput {
    name: String!
    description: String!
    address: String!
  }

  input UpdateDealInput {
    name: String
    description: String
    address: String
    status: String
  }

  type AdminLoginResult {
    success: Boolean!
  }

  type Mutation {
    createDeal(input: CreateDealInput!): Deal!
    updateDeal(id: String!, input: UpdateDealInput!): Deal!
    deleteDeal(id: String!): Deal!
    adminLogin(username: String!, password: String!): AdminLoginResult!
  }
`
