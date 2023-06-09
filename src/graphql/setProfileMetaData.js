import { gql } from "@apollo/client";

export const SET_PROFILE_METADATA = gql`
mutation createSetProfileMetadataTypedData($request: CreatePublicSetProfileMetadataURIRequest!) {
    createSetProfileMetadataTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileMetadataURIWithSig {
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
          profileId
          metadata
        }
      }
    }
  }
`;