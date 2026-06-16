"use client";

import Image from "next/image";

export default function BlogDetails({
  blog,
}) {
  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="bg-white">

      <Image
         src={blog.featuredImage}
        alt={blog.title}
       width={800}
  height={400}
         className="w-full h-[200px] object-cover"
      />

      <div className="mt-6">

        <h1 className="text-4xl font-bold mb-4">
          {blog.title}
        </h1>

        <div className="text-gray-500 mb-5">
          Admin |
          {" "}
          {new Date(
            Number(blog.createdAt)
          ).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )}
        </div>

        <p className="text-lg text-gray-600 mb-8">
          {blog.shortDescription}
        </p>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />
      </div>

    </div>
  );
}