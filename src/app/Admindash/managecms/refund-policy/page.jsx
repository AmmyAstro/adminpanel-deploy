"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import TapEditor from "@/components/Custom/TapEditor";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_REFUND_POLICY_PAGE,
  UPSERT_REFUND_POLICY_PAGE,
} from "@/app/graphQL/managecms";

export default function RefundPolicyAdminPage() {
  // =========================
  // FORM
  // =========================

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      title: "",

      content: "",

      metaTitle: "",

      metaDescription: "",

      keywords: [],

      status: "DRAFT",
    },
  });

  // =========================
  // GET PAGE
  // =========================

  const { data, loading } = useQuery(GET_REFUND_POLICY_PAGE);

  // =========================
  // UPSERT
  // =========================

  const [upsertRefundPolicyPage, { loading: updateLoading }] = useMutation(
    UPSERT_REFUND_POLICY_PAGE,
  );

  // =========================
  // RESET DATA
  // =========================

  useEffect(() => {
    if (data?.getRefundPolicyPage) {
      reset({
        title: data.getRefundPolicyPage.title || "",

        content: data.getRefundPolicyPage.content || "",

        metaTitle: data.getRefundPolicyPage.metaTitle || "",

        metaDescription: data.getRefundPolicyPage.metaDescription || "",

        keywords: data.getRefundPolicyPage.keywords || [],

        status: data.getRefundPolicyPage.status || "DRAFT",
      });
    }
  }, [data, reset]);

  // =========================
  // SUBMIT
  // =========================

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,

        keywords:
          typeof values.keywords === "string"
            ? values.keywords.split(",").map((item) => item.trim())
            : values.keywords,
      };

      await upsertRefundPolicyPage({
        variables: {
          input: payload,
        },
      });

      alert("Refund policy updated successfully");
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold">Refund Policy CMS</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* ================= TITLE ================= */}

          <div className="space-y-4">
            <label className="font-semibold">Page Title</label>

            <input
              {...register("title")}
              placeholder="Refund Policy"
              className="border p-4 rounded-xl w-full"
            />
          </div>

          {/* ================= CONTENT ================= */}

          <div className="space-y-4">
            <label className="font-semibold">Refund Policy Content</label>

            <TapEditor
              value={watch("content")}
              onChange={(value) => setValue("content", value)}
              placeholder="Refund policy content"
            />
          </div>

          {/* ================= SEO ================= */}

          <div className="border rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-semibold">SEO</h2>

            <input
              {...register("metaTitle")}
              placeholder="Meta Title"
              className="border p-4 rounded-xl w-full"
            />

            <textarea
              {...register("metaDescription")}
              placeholder="Meta Description"
              className="border p-4 rounded-xl w-full h-40"
            />

            <input
              {...register("keywords")}
              placeholder="keyword1, keyword2"
              className="border p-4 rounded-xl w-full"
            />

            <select
              {...register("status")}
              className="border p-4 rounded-xl w-full"
            >
              <option value="DRAFT">Draft</option>

              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          {/* ================= SUBMIT ================= */}

          <button
            type="submit"
            disabled={updateLoading}
            className="bg-purple-600 text-white px-10 py-4 rounded-xl"
          >
            {updateLoading ? "Saving..." : "Save Refund Policy"}
          </button>
        </form>
      </div>
    </div>
  );
}
