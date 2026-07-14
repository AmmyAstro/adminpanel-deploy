"use client";

import Image from "next/image";

export default function BlogSidebar({ categories }) {
  const recentPosts = [
    {
      title: "How to Use Yantra for Money Growth",
      image: "/blogs/yantra.webp",
      date: "Jun 11 2026",
    },
    {
      title: "Baglamukhi Kavach Benefits",
      image: "/blogs/baglamukhi.webp",
      date: "Jun 05 2026",
    },
    {
      title: "5 Mukhi Rudraksha Benefits",
      image: "/blogs/rudraksha.webp",
      date: "May 18 2026",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Recent Posts */}

      <div className="bg-white rounded-xl border border-gray-300 shadow-xl p-5">
        <h3 className="font-semibold text-gray-400 text-center uppercase mb-5">
          Recent Posts
        </h3>

        <div className="space-y-5">
          {recentPosts.map((post, index) => (
            <div key={index} className="flex p-2 shadow-xl rounded-xl gap-3">
              <Image
                src={post.image}
                alt={post.title}
                width={90}
                height={70}
                className="rounded-full object-cover"
              />

              <div>
                <h4 className="text-sm font-medium">{post.title}</h4>

                <p className="text-xs text-gray-400 mt-1">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}

      <div className="bg-white rounded-xl border border-gray-300 shadow-xl p-5">
        <h3 className="font-semibold text-center text-gray-400 uppercase mb-5">
          Categories
        </h3>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id}>{cat.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
