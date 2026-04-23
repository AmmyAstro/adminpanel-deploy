"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

/* ------------------ QUERIES ------------------ */

const GET_PRICE = gql`
  query ($astrologerId: String!) {
    getAdminPreviewPrice(astrologerId: $astrologerId) {
      chatPrice
      callPrice
      isOfferApplied
    }
  }
`;

const GET_CONFIG = gql`
  query {
    getPricingConfig {
      isFirstFreeEnabled
      chatOfferType
      callOfferType
    }
  }
`;

/* ------------------ MUTATION ------------------ */

const UPDATE_CONFIG = gql`
  mutation UpdatePricing(
    $isFirstFreeEnabled: Boolean
    $chatOfferType: OfferType
    $callOfferType: OfferType
  ) {
    updatePricingConfig(
      isFirstFreeEnabled: $isFirstFreeEnabled
      chatOfferType: $chatOfferType
      callOfferType: $callOfferType
    ) {
      id
    }
  }
`;

export default function PricingPanel() {
  const astrologerId = "astro123";

  /* ------------------ FETCH ------------------ */

  const { data, loading, refetch } = useQuery(GET_PRICE, {
    variables: { astrologerId }
  });

  const { data: configData } = useQuery(GET_CONFIG);

  /* ------------------ STATE ------------------ */

  const [form, setForm] = useState({
    isFirstFreeEnabled: true,
    chatOfferType: "FREE",
    callOfferType: "FREE"
  });

  /* load config */
 useEffect(() => {
  if (configData?.getPricingConfig) {
    setForm(configData.getPricingConfig);
  } else {
    // 👉 DEFAULT UI (no DB yet)
    setForm({
      isFirstFreeEnabled: true,
      chatOfferType: "FREE",
      callOfferType: "FREE"
    });
  }
}, [configData]);

  /* ------------------ MUTATION ------------------ */

  const [updateConfig] = useMutation(UPDATE_CONFIG, {
    onCompleted: () => {
      refetch();
    }
  });

  /* ------------------ HANDLER ------------------ */

  const handleSave = async () => {
    await updateConfig({
      variables: form
    });
  };

  if (loading) return <p>Loading...</p>;

 const price = data?.getAdminPreviewPrice;

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">

      {/* ================= USER VIEW ================= */}
      <div className="p-5 border rounded-xl">
        <h2 className="font-semibold mb-3">Current Price</h2>

        <div className="text-lg">
     <p>Chat: ₹{price?.chatPrice ?? 0}</p>
<p>Call: ₹{price?.callPrice ?? 0}</p>
        </div>
      </div>

      {/* ================= ADMIN PANEL ================= */}
      <div className="p-5 border rounded-xl">
        <h2 className="font-semibold mb-4">Pricing Config</h2>

        {/* Toggle */}
        <div className="flex items-center justify-between mb-4">
          <span>Enable First Time Offer</span>
          <button
            onClick={() =>
              setForm({
                ...form,
                isFirstFreeEnabled: !form.isFirstFreeEnabled
              })
            }
            className={`w-12 h-6 flex items-center rounded-full p-1 ${
              form.isFirstFreeEnabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow transform ${
                form.isFirstFreeEnabled ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* Chat Options */}
        <div className="mb-4">
          <p className="mb-1">Chat Pricing</p>
          <select
            className="w-full border p-2 rounded"
            value={form.chatOfferType}
            onChange={(e) =>
              setForm({ ...form, chatOfferType: e.target.value })
            }
          >
            <option value="FREE">Free</option>
            <option value="ONE_RUPEE">₹1</option>
            <option value="ORIGINAL">Original Price</option>
          </select>
        </div>

        {/* Call Options */}
        <div className="mb-4">
          <p className="mb-1">Call Pricing</p>
          <select
            className="w-full border p-2 rounded"
            value={form.callOfferType}
            onChange={(e) =>
              setForm({ ...form, callOfferType: e.target.value })
            }
          >
            <option value="FREE">Free</option>
            <option value="ONE_RUPEE">₹1</option>
            <option value="ORIGINAL">Original Price</option>
          </select>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full bg-black text-white py-2 rounded"
        >
          Update Pricing
        </button>
      </div>
    </div>
  );
}