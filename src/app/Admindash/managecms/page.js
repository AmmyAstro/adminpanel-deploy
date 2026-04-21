"use client";

import { useEffect, useState } from "react";
import { GET_DEPARTMENTS, GET_ROLES, GET_STAFF } from "@/app/graphQL/privilageOperations";
import { useQuery } from "@apollo/client/react";
import { GET_BANNERS, GET_FAQS, GET_TESTIMONIALS } from "@/app/graphQL/homeGql";

export default function Page() {
  const [userName, setUserName] = useState("");

  // ✅ Get user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  
  const { data: faqData, loading: faqLoading } = useQuery(GET_FAQS, {
    variables: { page: 1, limit: 50 },
  });

  const { data: testimonialData, loading: testimonialLoading } = useQuery(GET_TESTIMONIALS, {
    variables: { page: 1, limit: 50 },
  });

  const { data: bannerData, loading: bannerLoading } = useQuery(GET_BANNERS, {
    variables: { page: 1, limit: 50 },
  });

const faqs = faqData?.faqs || [];
  const testimonials = testimonialData?.testimonials || [];
  const banners = bannerData?.getBanners?.data || [];

  return (
    <div className="p-6 space-y-6 bg-[#1a012b]  rounded-xl text-white">


      <div className="bg-[#2c0a4d] px-6 py-4 rounded-xl shadow flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Welcome, <span className="text-yellow-400">{userName || "User"}</span> 👋
        </h1>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

       
        <div className="bg-[#2c0a4d] p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2 text-yellow-400">
            FAQs ({faqs.length})
          </h2>

          {faqLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
              {faqs.map((f) => (
                <li key={f.id}>• {f.question}</li>
              ))}
            </ul>
          )}
        </div>

      
        <div className="bg-[#2c0a4d] p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2 text-yellow-400">
            Testimonials ({testimonials.length})
          </h2>

          {testimonialLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
              {testimonials.map((t) => (
                <li key={t.id}>• {t.name}</li>
              ))}
            </ul>
          )}
        </div>

      
        <div className="bg-[#2c0a4d] p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2 text-yellow-400">
            Banners ({banners.length})
          </h2>

          {bannerLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <p className="text-sm text-gray-300">
              Total Banners: {banners.length}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}