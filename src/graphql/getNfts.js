import { gql } from "@apollo/client";


/* define a GraphQL query  */
export const GET_NFTS = gql`
query ($request: NFTsRequest!){
    nfts(request: $request) {
      items {
        contractName
        contractAddress
        symbol
        tokenId
        owners {
          amount
          address
        }
        name
        description
        contentURI
        originalContent {
          uri
          metaType
        }
        chainId
        collectionName
        ercType
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
    
  }
`;