import gql from 'graphql-tag'

export const CREATE_DEAL_MUTATION = gql`
  mutation CreateDeal($input: CreateDealInput!) {
    createDeal(input: $input) {
      id
      name
      description
      address
      status
    }
  }
`

export const UPDATE_DEAL_MUTATION = gql`
  mutation UpdateDeal($id: String!, $input: UpdateDealInput!) {
    updateDeal(id: $id, input: $input) {
      id
      name
      description
      address
      status
    }
  }
`

export const DELETE_DEAL_MUTATION = gql`
  mutation DeleteDeal($id: String!) {
    deleteDeal(id: $id) {
      id
    }
  }
`

export const ADMIN_LOGIN_MUTATION = gql`
  mutation AdminLogin($username: String!, $password: String!) {
    adminLogin(username: $username, password: $password) {
      success
    }
  }
`
