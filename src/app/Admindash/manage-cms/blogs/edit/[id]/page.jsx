"use client";

import { useParams } from "next/navigation";
import BlogForm from "../../BlogForm";

export default function EditBlogPage() {
  const params = useParams();

  console.log("wwwww",params);

  return (
    <BlogForm
      mode="edit"
    slug={params.id}
    />
  );
}