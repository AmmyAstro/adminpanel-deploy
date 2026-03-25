"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_MODULES } from "@/app/graphQL/privilageOperations";

export default function Homeside() {
  const { data, loading, error } = useQuery(GET_MODULES, {
    variables: { page: 1, limit: 100 },
  });

  const modules = data?.getModulesPaginated?.data || [];

  const TARGET_SECTION = "home";

  const sections = useMemo(() => {
    return modules
      .filter((m) => m.section?.toLowerCase() === TARGET_SECTION)
      .map((m) => ({
        name: m.name,
        slug: m.slug,
      }));
  }, [modules]);

  if (loading) return null;
  if (error) return <p className="text-red-500">Error</p>;

  return (
    <aside className="place-self-center bg-[#2c0a4d] text-yellow-400 flex flex-col py-6 rounded-r-xl w-30">
      <div className="flex flex-col space-y-3">
        {sections.map((item) => (
          <Link
            key={item.slug}
            href={`/Admindash/${item.slug}`}
            className="
              group
              overflow-hidden
              bg-yellow-500 text-black
              rounded-r-xl
                hover:scale-105 hover:px-4 w-fit
          
              transition-all duration-300 ease-in-out

              px-3 py-2
              whitespace-nowrap
            "
          >
            <span className="block text-xs line-clamp-2 ">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
