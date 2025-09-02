"use client";

import { useParams } from "next/navigation";
import Razordash from "@/components/DashPages/Razor/Razordash";

export default function Kundlipage() {
  const params = useParams();
  const path = (params.slug || []).map((p) => p.toLowerCase());



  if (!path || path.length === 0) {
    return <div>Invalid URL structure</div>;
  }

  const admindash = {
   razordash: <Razordash />,

  };

  

 

  let Componentrender = null;

  if (path.length === 1) {
    Componentrender = admindash[path[0]];
  } 

  return (
    <>
      {Componentrender ? (
        Componentrender
      ) : (
        <div className="text-center text-red-600 font-semibold py-10">
          Page not found: <code>{path.join(" / ")}</code>
        </div>
      )}
    </>
  );
}
