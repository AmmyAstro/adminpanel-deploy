"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

const GET_FREE_SERVICES = gql`
  query GetFreeServices {
    freeServices {
      id
      title
      icon
      href
      slug
      order
    }
  }
`;

const CREATE_FREE_SERVICE = gql`
  mutation CreateFreeService(
    $title: String!
    $icon: String!
    $href: String!
    $slug: String!
    $order: Int!
  ) {
    createFreeService(
      title: $title
      icon: $icon
      href: $href
      slug: $slug
      order: $order
    ) {
      id
      title
    }
  }
`;

const DELETE_FREE_SERVICE = gql`
  mutation DeleteFreeService($id: ID!) {
    deleteFreeService(id: $id)
  }
`;

export default function FreeServicesAdmin() {
  const [form, setForm] = useState({
    title: "",
    icon: "",
    href: "",
    slug: "",
    order: 0,
  });

  const { data, loading: queryLoading } =
    useQuery(GET_FREE_SERVICES);

  const [createService, { loading }] =
    useMutation(CREATE_FREE_SERVICE, {
      refetchQueries: [GET_FREE_SERVICES],
    });

  const [deleteService] =
    useMutation(DELETE_FREE_SERVICE, {
      refetchQueries: [GET_FREE_SERVICES],
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createService({
      variables: {
        ...form,
        order: Number(form.order),
      },
    });

    setForm({
      title: "",
      icon: "",
      href: "",
      slug: "",
      order: 0,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete Service?")) return;

    await deleteService({
      variables: { id },
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Create Form */}
      <div className="border border-gary-300 shadow-2xl rounded-xl p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Add Free Service
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-8"
        >
          <input
            className="border border-gary-300 shadow-2xl rounded-full p-3 "
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <input
            className="border border-gary-300 shadow-2xl rounded-full p-3 "
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug: e.target.value,
              })
            }
          />

          <input
            className="border p-3 border-gary-300 shadow-2xl rounded-full"
            placeholder="Href"
            value={form.href}
            onChange={(e) =>
              setForm({
                ...form,
                href: e.target.value,
              })
            }
          />

          <input
            className="border p-3 border-gary-300 shadow-2xl rounded-full"
            placeholder="Icon URL"
            value={form.icon}
            onChange={(e) =>
              setForm({
                ...form,
                icon: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="border p-3 border-gary-300 shadow-2xl rounded-full"
            placeholder="Order"
            value={form.order}
            onChange={(e) =>
              setForm({
                ...form,
                order: e.target.value,
              })
            }
          />

          <button
            className="bg-purple-600 text-white p-3  w-[50%] self-align-center justify-self-center shadow-2xl rounded-full"
            disabled={loading}
          >
            Add Service
          </button>
        </form>
      </div>

   
      <div className="border border-gary-300 shadow-2xl  rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Free Services
        </h2>

        {queryLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gary-300  bg-purple-100 rounded-xl p-2">
                <th className="text-left py-3">Title</th>
                <th className="text-left py-3">Slug</th>
                <th className="text-left py-3">Href</th>
                <th className="text-left py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {data?.freeServices?.map((service) => (
                <tr
                  key={service.id}
                  className="border-b"
                >
                  <td className="py-3">
                    {service.title}
                  </td>

                  <td>{service.slug}</td>

                  <td>{service.href}</td>

                  <td>
                    <button
                      onClick={() =>
                        handleDelete(service.id)
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}