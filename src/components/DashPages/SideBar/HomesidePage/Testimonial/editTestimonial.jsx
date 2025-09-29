"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTestimonialRequest } from "@/app/redux/slices/testimonialSlice";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import { useRouter } from "next/navigation";
toast
export default function EditTestimonial({ testimonial }) {
  alert("Editing testimonial:", testimonial);
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.testimonials || {});

  const [form, setForm] = useState({
    name: testimonial?.name || "",
    location: testimonial?.location || "",
    description: testimonial?.description || "",
    fileType: testimonial?.fileType || "profile-image",
    file: null,
    videoLink: testimonial?.videoLink || "",
    youtubeLink: testimonial?.youtubeLink || "",
    rating: testimonial?.rating || 1,
    status: testimonial?.status || "active",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm({ ...form, [name]: files[0] });
    else setForm({ ...form, [name]: value });
  };

  // Submit update
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    dispatch(updateTestimonialRequest({ id: testimonial.id, formData }));
  };

  // Reset form
  const handleReset = () => {
    setForm({
      name: testimonial?.name || "",
      location: testimonial?.location || "",
      description: testimonial?.description || "",
      fileType: testimonial?.fileType || "profile-image",
      file: null,
      videoLink: testimonial?.videoLink || "",
      youtubeLink: testimonial?.youtubeLink || "",
      rating: testimonial?.rating || 1,
      status: testimonial?.status || "active",
    });
  };

  // Show success toast & redirect after update
  useEffect(() => {
    if (!loading && !error) {
      toast.success("Testimonial updated successfully!");
      router.push("/Admindash/testimonialmain");
    }
  }, [loading, error, router]);

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      <div className="m-4 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#2c0a4d] mb-6">Edit Testimonial</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Name */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">Name</label>
              <div className="flex items-center gap-2 border border-gray-400 rounded-xl px-2 p-1">
                <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                <CustomInput
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full outline-none border-0 bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">Location</label>
              <div className="flex items-center gap-2 border border-gray-400 rounded-xl p-1">
                <img src="/admin-img/location.png" alt="location" className="input-img-side" />
                <CustomInput
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full outline-none border-0 bg-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-1">Testimonial Description</label>
            <div className="flex items-start gap-2 border border-gray-400 rounded-xl p-1">
              <img src="/admin-img/id-badge.png" alt="desc" className="input-img-side" />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full outline-none bg-transparent resize-none"
                rows="3"
                required
              ></textarea>
            </div>
          </div>

          {/* File / Video Link */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">File Type</label>
              <select
                name="fileType"
                value={form.fileType}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
              >
                <option value="profile-image">Profile Image</option>
                <option value="video-link">Video Link</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">
                {form.fileType === "video-link" ? "Video Link" : "Profile Image"}
              </label>
              {form.fileType === "profile-image" ? (
                <CustomInput
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
                />
              ) : (
                <CustomInput
                  type="text"
                  name="videoLink"
                  value={form.videoLink}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
                />
              )}
            </div>
          </div>

          {/* Youtube Link */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-1">Youtube Link</label>
            <CustomInput
              type="text"
              name="youtubeLink"
              value={form.youtubeLink}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-xl p-1 outline-none"
            />
          </div>

          {/* Rating & Status */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">Rating</label>
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 items-center justify-center mt-4">
            <CustomButton type="submit" variant="green" className="bg-[#2c0a4d] text-white px-6 py-2">
              {loading ? "Updating..." : "Update"}
            </CustomButton>
            <CustomButton
              type="button"
              variant="gray"
              onClick={handleReset}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
            >
              Reset
            </CustomButton>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
