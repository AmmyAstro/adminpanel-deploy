"use client";

import { useState } from "react";

import {
 GET_OFFERS,
  CREATE_OFFER,
  UPDATE_OFFER,
  DELETE_OFFER,
} from "@/app/graphQL/astroHiring";
import { useMutation, useQuery } from "@apollo/client/react";


export default function OffersPage() {
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    offerName: "",
    price: "",
    description: "",
    isActive: true,
  });

  const [editMode, setEditMode] = useState(false);

  const { data, loading, refetch } = useQuery(GET_OFFERS);

  const [createOffer, { loading: createLoading }] =
    useMutation(CREATE_OFFER);

  const [updateOffer, { loading: updateLoading }] =
    useMutation(UPDATE_OFFER);

  const [deleteOffer] = useMutation(DELETE_OFFER);

  const offers = data?.offers || [];

  const filteredOffers = offers.filter((offer) =>
    offer.offerName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      id: "",
      offerName: "",
      price: "",
      description: "",
      isActive: true,
    });

    setEditMode(false);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateOffer({
          variables: {
            id: formData.id,
            offerName: formData.offerName,
            price: Number(formData.price),
            description: formData.description,
            isActive: formData.isActive,
          },
        });
      } else {
        await createOffer({
          variables: {
            offerName: formData.offerName,
            price: Number(formData.price),
            description: formData.description,
          },
        });
      }

      resetForm();
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this offer?")) return;

    try {
      await deleteOffer({
        variables: { id },
      });

      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (offer) => {
    setEditMode(true);

    setFormData({
      id: offer.id,
      offerName: offer.offerName,
      price: offer.price,
      description: offer.description,
      isActive: offer.isActive,
    });
  };

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Offers Management
        </h1>

        <input
          type="text"
          placeholder="Search offer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-lg border px-4 py-2"
        />
      </div>

      {/* Form */}

      <div className="mb-8 rounded-xl border p-5">
        <h2 className="mb-4 text-lg font-semibold">
          {editMode ? "Update Offer" : "Create Offer"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <input
            placeholder="Offer Name"
            className="rounded border p-3"
            value={formData.offerName}
            onChange={(e) =>
              setFormData({
                ...formData,
                offerName: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="rounded border p-3"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: e.target.value,
              })
            }
          />

          <textarea
            rows={4}
            placeholder="Description"
            className="rounded border p-3 md:col-span-2"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </div>

        <div className="mt-4 flex gap-3">

          <button
            onClick={handleSubmit}
            disabled={createLoading || updateLoading}
            className="rounded bg-blue-600 px-5 py-2 text-white"
          >
            {editMode ? "Update" : "Create"}
          </button>

          {editMode && (
            <button
              onClick={resetForm}
              className="rounded bg-gray-500 px-5 py-2 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Offer</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan={5} className="p-5 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              filteredOffers.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {offer.offerName}
                  </td>

                  <td className="p-3">
                    ₹{offer.price}
                  </td>

                  <td className="p-3">
                    {offer.description}
                  </td>

                  <td className="p-3">
                    {offer.isActive
                      ? "Active"
                      : "Inactive"}
                  </td>

                  <td className="flex gap-2 p-3">
                    <button
                      onClick={() =>
                        handleEdit(offer)
                      }
                      className="rounded bg-green-600 px-3 py-1 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(offer.id)
                      }
                      className="rounded bg-red-600 px-3 py-1 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}