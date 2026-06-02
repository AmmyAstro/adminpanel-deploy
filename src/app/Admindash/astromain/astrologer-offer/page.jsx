"use client";

import { useMemo, useState } from "react";

import {
  GET_OFFERS,
  CREATE_OFFER,
  UPDATE_OFFER,
  DELETE_OFFER,
} from "@/app/graphQL/astroHiring";
import { useMutation, useQuery } from "@apollo/client/react";

export default function OfferPage() {
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
  });

  const [editMode, setEditMode] = useState(false);

  const { data, loading, refetch } = useQuery(GET_OFFERS);

  const [createOffer] = useMutation(CREATE_OFFER);
  const [updateOffer] = useMutation(UPDATE_OFFER);
  const [deleteOffer] = useMutation(DELETE_OFFER);

  const offers = data?.getOffers  || [];

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) =>
      offer.offerName?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [offers, search]);

  const resetForm = () => {
    setEditMode(false);

    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
    });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateOffer({
          variables: {
            id: formData.id,
            offerName: formData.name,
            description: formData.description,
            price: Number(formData.price),
            isActive: true,
          },
        });
      } else {
        await createOffer({
          variables: {
            offerName: formData.name,
            description: formData.description,
            price: Number(formData.price),
          },
        });
      }

      resetForm();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (offer) => {
    setEditMode(true);

    setFormData({
      id: offer.id,
      name: offer.name,
      description: offer.description,
      price: offer.price,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this offer?")) return;

    try {
      await deleteOffer({
        variables: { id },
      });

      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Offer Management</h1>

          <input
            type="text"
            placeholder="Search Offer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-lg border px-4 py-2"
          />
        </div>

        {/* Form */}

        <div className="p-5 mb-8 bg-white border rounded-xl">
          <h2 className="mb-4 text-xl font-semibold">
            {editMode ? "Update Offer" : "Create Offer"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Offer Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="p-3 border rounded-lg"
            />

            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value,
                })
              }
              className="p-3 border rounded-lg"
            />

            <textarea
              rows={4}
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="p-3 border rounded-lg md:col-span-2"
            />
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSubmit}
              className="px-5 py-2 text-white bg-blue-600 rounded-lg"
            >
              {editMode ? "Update Offer" : "Create Offer"}
            </button>

            {editMode && (
              <button
                onClick={resetForm}
                className="px-5 py-2 text-white bg-gray-500 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Table */}

        <div className="overflow-hidden bg-white border rounded-xl">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredOffers.length ? (
                filteredOffers.map((offer) => (
                  <tr key={offer.id} className="border-t">
                    <td className="p-4 font-medium">{offer.offerName}</td>

                    <td className="p-4">{offer.description}</td>

                    <td className="p-4">₹{offer.price}</td>

                    <td className="p-4">
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="px-3 py-1 text-white bg-green-600 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(offer.id)}
                          className="px-3 py-1 text-white bg-red-600 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    No Offers Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
