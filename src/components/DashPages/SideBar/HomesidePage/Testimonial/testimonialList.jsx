"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestimonialsRequest,
  deleteTestimonialRequest,
} from "@/app/redux/slices/testimonialSlice";
import toast from "react-hot-toast";

export default function TestimonialList() {
  const dispatch = useDispatch();
  const { testimonials, loading, error } = useSelector(
    (state) => state.testimonial 
  );

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Fetch testimonials on mount
  useEffect(() => {
    dispatch(fetchTestimonialsRequest());
  }, [dispatch]);

  // Edit handler
  const handleEdit = (id) => {
    alert(`Edit testimonial with ID: ${id}`);
  };

  // Delete handler
  const handleDelete = (id) => {
    dispatch(deleteTestimonialRequest(id));
    toast.success("Testimonial deleted successfully!");
  };

  // Apply filter
  const filtered = testimonials.filter((t) =>
    t.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      <div className="flex justify-between items-center p-4">
        <h3 className="heading-banner">Testimonial List</h3>
        <input
          type="text"
          placeholder="Filter by name..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-400 rounded-xl p-2 outline-none bg-white text-black w-64"
        />
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="p-4 flex flex-col gap-3">
        <div className="grid grid-cols-6 place-items-center font-semibold border-b py-5 bg-[#7a5ba3] rounded-lg text-white px-4">
          <div>S.no</div>
          <div>Name</div>
          <div>Location</div>
          <div>File</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {paginated.map((t, idx) => (
          console.log(t),
          <div
            key={t.id}
            className="grid grid-cols-6 place-items-center border-b py-4 bg-white rounded-lg px-4"
          >
            <div>{(page - 1) * pageSize + idx + 1}</div>
            <div>{t.name}</div>
            <div>{t.location}</div>
            <div>
              {t.fileType === "profile-image" ? (
                <img
                  src={`http://localhost:5000/${t.fileUrl}`}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <a
                  href={t.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Video Link
                </a>
              )}
            </div>
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  t.status === "active"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {t.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                onClick={() => handleEdit(t.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(t.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              className="px-3 py-1 rounded border bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="px-2">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded border bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
