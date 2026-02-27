import gql from 'graphql-tag'

export const DEALS_QUERY = gql`
  query Deals {
    deals {
      id
      name
      description
      address
      status
    }
  }
`
