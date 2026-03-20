"use client";

import { useEffect } from "react";
import { ApolloProvider } from "@apollo/client/react";
import client, { authTokenVar } from "../components/utils/apolloClient";

export default function ApolloWrapper({ children }) {

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      authTokenVar(token);
      console.log("Hydrated token:", token); // debug
    }
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}