"use client";

import CustomButton from "@/components/Custom/CustomButtom";
import { useState } from "react";

export default function Giftpage() {
  const [showForm, setShowForm] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    status: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGifts([...gifts, formData]);
    setFormData({ title: "", amount: "", status: "", image: null });
    setShowForm(false);
  };

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="heading-banner">Gifts</h3>
        <CustomButton variant={"green"}
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-white  "
        >
          Add New Gift
        </CustomButton>
      </div>

      {/* Gift Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="border rounded-md p-2 outline-none"
                placeholder="Enter gift title"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Amount</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="border rounded-md p-2 outline-none"
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border rounded-md p-2 outline-none"
                required
              >
                <option value="" hidden>
                  Select Status
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Image Upload + Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                className="border p-2 rounded-md"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Gift List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h5 className="text-lg font-semibold mb-4">Gift List</h5>
        {gifts.length === 0 ? (
          <p className="text-gray-500">No gifts added yet.</p>
        ) : (
          <div className="space-y-4">
            {gifts.map((gift, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <h6 className="font-medium">{gift.title}</h6>
                  <p className="text-sm text-gray-600">
                    Amount: {gift.amount} | Status: {gift.status}
                  </p>
                </div>
                {gift.image && (
                  <img
                    src={URL.createObjectURL(gift.image)}
                    alt="Gift"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
