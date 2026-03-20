// components/ProtectedActionButton.jsx
"use client";

import { hasPermission } from "@/app/helper/permissionHelper";
import { usePermissions } from "@/hooks/usePermission";

export default function ProtectedActionButton({
  module,
  action,
  executeAction,
  mutationFn,
  variables,
  onSuccess,
  children,
  className,
}) {
  const { permissions } = usePermissions();

  const allowed = hasPermission(permissions, module, action);

  return (
    <button
      disabled={!allowed}
      onClick={() => {
        if (!allowed) return;

        executeAction({
          module,
          action,
          mutationFn,
          variables,
          onSuccess,
        });
      }}
      className={`${className} ${
        !allowed ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}