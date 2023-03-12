import {ApolloClient, gql,InMemoryCache,HttpLink,ApolloLink} from '@apollo/client'

const LENS_API_URL = "https://api-mumbai.lens.dev/"; 


export const client = new ApolloClient({
  uri: LENS_API_URL,
  cache: new InMemoryCache(),
});


export const DEFAULT_PROFILE = gql`
mutation ($request: CreateSetDefaultProfileRequest!){
    createSetDefaultProfileTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetDefaultProfileWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          wallet
          profileId
        }
      }
    }
  }
`;