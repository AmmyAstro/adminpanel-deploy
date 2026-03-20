// hooks/useActionHandler.js
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { hasPermission } from "@/app/helper/permissionHelper";
import { usePermissions } from "@/hooks/usePermission";

export const useActionHandler = () => {
  const { permissions } = usePermissions();
  const [confirmState, setConfirmState] = useState(null);

  const executeAction = async ({
    permission,
    module,
    action,
    mutationFn,
    variables,
    onSuccess,
  }) => {
    // 🔐 Permission check
    if (!hasPermission(permissions, module, action)) {
      toast.error(
        "You are not authorized to perform this action. Contact your Super Admin / Manager."
      );
      return;
    }

    // 🔥 Open confirm modal
    setConfirmState({
      mutationFn,
      variables,
      onSuccess,
    });
  };

  const handleConfirm = async () => {
    try {
      const { mutationFn, variables, onSuccess } = confirmState;

      const res = await mutationFn({ variables });

      // 🔥 Handle both structured + boolean responses
      const result = res?.data?.[Object.keys(res.data)[0]];

      if (typeof result === "boolean") {
        toast.success("Action successful");
      } else if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result?.error || "Action failed");
      }

      if (onSuccess) onSuccess();

    } catch (err) {
      const message =
        err?.graphQLErrors?.[0]?.message ||
        err?.networkError?.result?.errors?.[0]?.message ||
        err.message;

      if (message.includes("Unauthorized")) {
        toast.error(
          "You are not authorized to perform this action."
        );
      } else if (message.includes("assigned")) {
        toast.error(message);
      } else {
        toast.error(message || "Something went wrong");
      }
    }

    setConfirmState(null);
  };

  return {
    confirmState,
    setConfirmState,
    executeAction,
    handleConfirm,
  };
};