import { gql } from "@apollo/client"

export const ADD_REACTION = gql`
mutation addReaction($request: ReactionRequest!) {
    addReaction(request: $request)
}`
;
