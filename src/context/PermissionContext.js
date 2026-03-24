"use client";

import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MY_ACCESS } from "@/app/graphQL/privilageOperations";

const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const { data, loading } = useQuery(GET_MY_ACCESS, {
    skip: !token,
  });

  // ✅ memoize permissions
  const permissions = useMemo(() => {
    return data?.getMyAccess || [];
  }, [data]);

  const isSuperAdmin = useMemo(() => {
    if (!permissions.length) return false;

    // if all modules coming → assume superadmin
    return permissions.every(
      (mod) =>
        mod.permissions.includes(`${mod.slug}.create`) &&
        mod.permissions.includes(`${mod.slug}.read`) &&
        mod.permissions.includes(`${mod.slug}.update`) &&
        mod.permissions.includes(`${mod.slug}.delete`)
    );
  }, [permissions]);

  const can = (module, action) => {
    if (isSuperAdmin) return true;

    return permissions.some(
      (mod) =>
        mod.slug === module &&
        mod.permissions.includes(`${module}.${action}`)
    );
  };

  // 🔥 THIS IS YOUR ANSWER (yahi add karna hai)
  const value = useMemo(() => {
    return {
      permissions,
      loading,
      can,
      isSuperAdmin,
    };
  }, [permissions, loading]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error("usePermissions must be used inside PermissionProvider");
  }

  return context;
};