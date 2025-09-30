"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestimonialsRequest,
  deleteTestimonialRequest,
} from "@/app/redux/slices/testimonialSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function TestimonialList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { testimonials, loading, error } = useSelector((state) => state.testimonial);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch testimonials on mount
  useEffect(() => {
    dispatch(fetchTestimonialsRequest());
  }, [dispatch]);

  // Memoized handlers for edit and delete
  const handleEdit = useCallback(
    (id) => router.push(`/Admindash/editTestimonial/${id}`),
    [router]
  );

  const handleDelete = useCallback(
    (id) => {
      dispatch(deleteTestimonialRequest(id));
      toast.success("Testimonial deleted successfully!");
    },
    [dispatch]
  );

  // Handle filter change
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to first page on filter change
  }, []);

  // Filter and paginate testimonials
  const filteredTestimonials = testimonials.filter((t) =>
    t.name.toLowerCase().includes(filter.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTestimonials.length / pageSize);
  const paginatedTestimonials = filteredTestimonials.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="bg-[#928f8f34] p-6 rounded-lg">
      {/* Header with Filter Input */}
      <div className="flex justify-between items-center p-4">
        <h3 className="heading-banner text-xl font-semibold">Testimonial List</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Filter by name..."
            value={filter}
            onChange={handleFilterChange}
            className="border border-gray-400 rounded-xl p-2 outline-none bg-white text-black w-64 placeholder-gray-500"
            aria-label="Filter testimonials by name"
          />
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Testimonial Table */}
      <div className="p-4 flex flex-col gap-3">
        <div className="grid grid-cols-6 place-items-center font-semibold border-b py-5 bg-[#7a5ba3] rounded-lg text-white px-4">
          <div>S.no</div>
          <div>Name</div>
          <div>Location</div>
          <div>File</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {paginatedTestimonials.map((testimonial, idx) => (
          <div
            key={testimonial.id}
            className="grid grid-cols-6 place-items-center border-b py-4 bg-white rounded-lg px-4"
          >
            <div>{(page - 1) * pageSize + idx + 1}</div>
            <div>{testimonial.name}</div>
            <div>{testimonial.location}</div>
            <div>
              {testimonial.fileType === "profile-image" ? (
               <img
                src={`${BASE_URL}/${(testimonial.fileUrl || "").replace(/\\/g, "/")}`}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/admin-img/user.png";
                }}
              />
              ) : (
                <a
                  href={testimonial.fileUrl}
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
                  testimonial.status === "active"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {testimonial.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(testimonial.id)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition flex items-center justify-center"
                title="Edit"
                aria-label={`Edit testimonial for ${testimonial.name}`}
              >
                <FiEdit size={18} />
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition flex items-center justify-center"
                title="Delete"
                aria-label={`Delete testimonial for ${testimonial.name}`}
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded border bg-gray-200 text-gray-700 disabled:opacity-50"
            aria-label="Previous page"
          >
            Prev
          </button>
          <span className="px-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border bg-gray-200 text-gray-700 disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}