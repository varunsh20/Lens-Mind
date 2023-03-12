import {ApolloClient,InMemoryCache,HttpLink,ApolloLink} from "@apollo/client";
import {getAuthenticationToken,getRefreshToken,setAuthenticationToken} from "./graphql/auth/store.js";
import { refreshAuth } from "./graphql/auth/refresh.js";
import jwt_decode from "jwt-decode";
  

let decoded;
  
const LENS_API_URL = "https://api-mumbai.lens.dev/"; 
const httpLink = new HttpLink({ uri: LENS_API_URL });
  
const authLink = new ApolloLink((operation, forward) => {
    const token = getAuthenticationToken();
    const refreshToken = getRefreshToken();
    if (token) decoded = jwt_decode(token);
  
    // Use the setContext method to set the HTTP headers.
    operation.setContext({
      headers: {
        "x-access-token": token ? `Bearer ${token}` : ""
      },
    });
  
    if (token && decoded.exp < Date.now() / 1000) {
      refreshAuth(refreshToken).then((res) => {
        operation.setContext({
          headers: {
            "x-access-token": token
              ? `Bearer ${res.data.refresh.accessToken}`
              : "",
            "Access-Control-Allow-Origin": "*",
          },
        });
        setAuthenticationToken({ token: res.data.refresh });
      });
    }
  
    // Call the next link in the middleware chain.
    return forward(operation);
  });
  
  export const apolloClient = () => {
    const apolloClient = new ApolloClient({
      link: authLink.concat(httpLink),
      uri: LENS_API_URL,
      cache: new InMemoryCache(),
    });
    return apolloClient;
  };
  