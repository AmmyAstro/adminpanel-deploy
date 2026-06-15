"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_BLOG_BY_SLUG } from "@/app/graphQL/managecms";
import BlogDetails from "../BlogDetail";

export default function Page() {
  const params = useParams();

  const slug = params?.slug;

  const { data, loading } = useQuery(
    GET_BLOG_BY_SLUG,
    {
      variables: { slug },
      skip: !slug,
    }
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BlogDetails
      blog={data?.blogBySlug}
    />
  );
}