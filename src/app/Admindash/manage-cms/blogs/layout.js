"use client";
import { useQuery } from "@apollo/client/react";
import BlogSidebar from "./BlogSidebar";
import { GET_BLOG_CATEGORIES } from "@/app/graphQL/managecms";
import Link from "next/link";

export default function BlogLayout({ children }) {
  const { data: categoryData } = useQuery(GET_BLOG_CATEGORIES);
  const isBlogPage = pathname.startsWith("/manage-cms/blogs/create");

  return (
    <div className="container mx-auto py-10">
      {!isBlogPage && (
        <Link
          href="/Admindash/manage-cms/blogs/create"
          className="bg-indigo-600 text-white px-6 py-3 rounded-full"
        >
          Add New Blog
        </Link>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">{children}</div>

        <BlogSidebar categories={categoryData?.blogCategories || []} />
      </div>
    </div>
  );
}
