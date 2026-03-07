"use client";

import { ApolloProvider } from "@apollo/client/react";
import client from "../components/utils/apolloClient";

export default function ApolloWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}