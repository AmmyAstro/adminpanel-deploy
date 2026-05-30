"use client";

import {
  ApolloClient,
  InMemoryCache,
  from,
  makeVar,
  split,
  HttpLink,
} from "@apollo/client";

import { getMainDefinition } from "@apollo/client/utilities";

import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

export const authTokenVar = makeVar(null);


const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://dhwaniastro.com/adminAuth/graphql",
});

// upload link
const uploadLink = new UploadHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://dhwaniastro.com/adminAuth/graphql",
  headers: {
    "apollo-require-preflight": "true",
  },
});

// 🔥 split logic
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" &&
      definition.operation === "mutation" &&
      definition.name?.value === "UploadImage"; 
  },
  uploadLink,
  httpLink
);
// 🔐 Auth Link
const authLink = setContext((_, { headers }) => {
  const token = authTokenVar();

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// ⚠️ Error Link (optional but good)
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("GraphQL Errors:", graphQLErrors);
  }
  if (networkError) {
    console.log("Network Error:", networkError);
  }
});

// 🚀 FINAL CLIENT
const client = new ApolloClient({
  link: from([
    errorLink,
    authLink,   
       link,
  ]),
  cache: new InMemoryCache(),
});

export default client;