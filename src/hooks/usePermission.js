import {  useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MY_ACCESS } from "@/app/graphQL/privilageOperations";

export const usePermissions = () => {
  const token = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }, []);

  const { data, loading, error } = useQuery(GET_MY_ACCESS, {
    skip: !token,
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    console.log("TOKEN:", token);
    console.log("DATA:", data);
    console.log("ERROR:", error);
    console.log("LOADING:", loading);
  }, [data, error, loading]);

  if (error) {
    return {
      permissions: [],
      loading: false,
    };
  }

  return {
    permissions: data?.getMyAccess || [],
    loading,
  };
};