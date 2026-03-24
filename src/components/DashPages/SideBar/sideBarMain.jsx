"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/context/PermissionContext";
import { GET_MODULES_BY_SECTION } from "@/app/graphQL/privilageOperations";
import sidebarConfig, { iconMap } from "@/components/utils/sidebarConfig";
import { useQuery } from "@apollo/client/react";

export default function SideBarMain() {
  const pathname = usePathname();
  const path = pathname.split("/");


  const section = path[2];

  const { can, isSuperAdmin } = usePermissions();


  const { data, loading } = useQuery(GET_MODULES_BY_SECTION, {
    variables: { section },
    skip: !section,
  });

  const modules = data?.getModulesBySection || [];
console.log("pathname:", pathname);
console.log("section:", section);

  const allowedModules = modules.filter(
    (mod) => isSuperAdmin || can(mod.slug, "read")
  );

  const isActive = (href) => pathname.startsWith(href);

  const renderItem = (item) => {
    const Icon = iconMap[item.icon] || iconMap.default;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
        ${isActive(item.href)
            ? "bg-yellow-500 text-black"
            : "hover:bg-[#ffffff14] text-white"
          }`}
      >
        <Icon
          className={`text-lg ${isActive(item.href) ? "text-black" : "text-yellow-400"
            }`}
        />

        <span className="hidden md:inline text-[13px]">
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <aside className="fixed px-3 top-14 bottom-10 left-0 w-20 md:w-48 bg-[#2c0a4d] flex flex-col py-6 space-y-3 overflow-y-auto">

      {sidebarConfig.static.map((item) => renderItem(item))}


      {!loading && allowedModules.length > 0 && (
        <div className="mt-4 space-y-2">

          <p className="text-[10px] text-gray-400 px-3 uppercase tracking-wider">
            {section}
          </p>

          {allowedModules.map((mod) =>
            renderItem({
              name: mod.name,
              href: `/Admindash/${section}/${mod.slug}`,
              icon: "default",
            })
          )}

        </div>
      )}
    </aside>
  );
}