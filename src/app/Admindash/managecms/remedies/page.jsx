"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import TapEditor from "@/components/Custom/TapEditor";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CREATE_REMEDY,
  DELETE_REMEDY,
  GET_REMEDIES,
  UPDATE_REMEDY,
} from "@/app/graphQL/managecms";
import toast from "react-hot-toast";

export default function RemedyAdminPage() {


  const [editId, setEditId] = useState(null);



  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      title: "",

      description: "",

      isActive: true,
    },
  });



  const { data, loading, refetch } = useQuery(GET_REMEDIES);

  

  const [createRemedy, { loading: createLoading }] = useMutation(CREATE_REMEDY);


  const [updateRemedy, { loading: updateLoading }] = useMutation(UPDATE_REMEDY);



  const [deleteRemedy] = useMutation(DELETE_REMEDY);



  const onSubmit = async (values) => {
    try {


      if (editId) {
        await updateRemedy({
          variables: {
            id: editId,

            input: {
              title: values.title,

              description: values.description,

              isActive: values.isActive,
            },
          },
        });

        toast.success("Remedy Updated")
      }

      
      else {
        await createRemedy({
          variables: {
            input: {
              title: values.title,

              description: values.description,
            },
          },
        });

       toast.success("Remedy Created")
      }



      reset({
        title: "",
        description: "",
        isActive: true,
      });

      setEditId(null);

      refetch();
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };



  const handleEdit = (item) => {
    setEditId(item.id);

    reset({
      title: item.title,

      description: item.description,

      isActive: item.isActive,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this remedy?");

    if (!confirmDelete) return;

    try {
      await deleteRemedy({
        variables: {
          id,
        },
      });

      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10 space-y-10">
      {/* ================= FORM ================= */}

      <div className="border rounded-2xl p-6 space-y-6">
        <h2 className="text-3xl font-bold">
          {editId ? "Update Remedy" : "Create Remedy"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* TITLE */}

          <input
            {...register("title")}
            placeholder="Remedy Title"
            className="border p-4 rounded-xl w-full"
          />

          {/* DESCRIPTION */}

          <TapEditor
            value={watch("description")}
            onChange={(value) => setValue("description", value)}
            placeholder="Remedy Description"
          />

          {/* ACTIVE */}

          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("isActive")} />

            <label>Active Remedy</label>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={createLoading || updateLoading}
            className="bg-purple-600 text-white px-8 py-3 rounded-xl"
          >
            {createLoading || updateLoading
              ? "Saving..."
              : editId
                ? "Update Remedy"
                : "Create Remedy"}
          </button>
        </form>
      </div>

      {/* ================= LIST ================= */}

      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Remedies</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          data?.getRemedies?.map((item) => (
            <div key={item.id} className="border rounded-2xl p-6 space-y-5">
              {/* HEADER */}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Status: {item.isActive ? "Active" : "Inactive"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div
                dangerouslySetInnerHTML={{
                  __html: item.description,
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
