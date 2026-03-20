"use client";

import sidebarConfig, { iconMap } from "@/components/utils/sidebarConfig";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/hooks/usePermission";
import { moduleConfig } from "@/components/utils/moduleConfig";

export default function SideBarMain() {
  const pathname = usePathname();

  // 🔥 Extract section from URL
  const path = pathname.split("/");

  const sectionMap = {
    privilegemain: "privilege",
    astromain: "astrologer",
    managecms: "cms",
    custommain: "customer",
  };

  const section = sectionMap[path[2]] || null;

  const { permissions, loading } = usePermissions();

  if (loading) return null;

  const allModules = permissions || [];

  // 🔥 Filter using moduleConfig
const allowedModules = permissions.filter((mod) => {
  const config = moduleConfig[mod.slug];
  return config && config.section === section;
});

  const staticItems = sidebarConfig.static;
  const sectionItems = sidebarConfig.sections?.[section] || [];

  // ✅ Better active logic
  const isActive = (href) => pathname.startsWith(href); 

  const renderItem = (item) => {
    const Icon = iconMap[item.icon] || iconMap.default;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
        ${
          isActive(item.href)
            ? "bg-yellow-500 text-black scale-105"
            : "hover:bg-[#ffffff14] text-white"
        }`}
      >
        <Icon
          className={`text-lg ${
            isActive(item.href) ? "text-black" : "text-yellow-400"
          }`}
        />

        <span
          className={`hidden md:inline text-[13px] ${
            isActive(item.href)
              ? "text-black font-semibold"
              : "text-white"
          }`}
        >
          {item.name}
        </span>
      </Link>
    );
  };

  // 🔥 Section title mapping
  const sectionTitleMap = {
    privilege: "Privilege",
    astrologer: "Astrologer",
    cms: "CMS",
    customer: "Customer",
  };

  return (
    <aside className="fixed px-3 top-14 bottom-10 left-0 w-20 md:w-48 bg-[#2c0a4d] flex flex-col py-6 space-y-3 overflow-y-auto">

      {/* STATIC */}
      {staticItems.map((item) => renderItem(item))}

      {/* SECTION STATIC */}
      {sectionItems.length > 0 && (
        <div className="mt-3 space-y-2">
          {sectionItems.map((item) => renderItem(item))}
        </div>
      )}

      {/* 🔥 DYNAMIC MODULES */}
      {sidebarConfig.dynamic && allowedModules.length > 0 && (
        <div className="mt-4 space-y-2">

          {/* Section Title */}
          <p className="text-[10px] text-gray-400 px-3 uppercase tracking-wider">
            {sectionTitleMap[section] || section}
          </p>

          {/* Modules */}
          {allowedModules.map((mod) => {
            const config = moduleConfig[mod.slug];
            if (!config) return null;

            return renderItem({
              name: mod.name,
              href: `/Admindash/${config.section}main/${config.route}`,
              icon: config.icon || "default",
            });
          })}
        </div>
      )}
    </aside>
  );
}