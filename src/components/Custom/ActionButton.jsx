// components/ProtectedActionButton.jsx
"use client";

import { usePermissions } from "@/context/PermissionContext";


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
    const { can, isSuperAdmin } = usePermissions();

    const allowed = isSuperAdmin || can(module, action);

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
            className={`${className} ${!allowed ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
                }`}
        >
            {children}
        </button>
    );
}