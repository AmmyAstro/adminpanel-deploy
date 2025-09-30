"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTestimonialRequest } from "@/app/redux/slices/testimonialSlice";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddTestimonial() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, testimonials, error } = useSelector((s) => s.testimonials || {});

  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    fileType: "profile-image",
    file: null,
    videoLink: "",
    youtubeLink: "",
    rating: 1,
    status: "active",
  });

  useEffect(() => {
    if (!loading && Array.isArray(testimonials) && testimonials.length) {
      router.push("/Admindash/testimonialmain");
    }
  }, [loading, testimonials, router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setForm({ ...form, [name]: files[0] });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    const serializableData = { fileName: form.file ? form.file.name : null };

    dispatch(addTestimonialRequest({ formData, ...serializableData }));
    toast.success("Testimonial added successfully!");
    router.push("/Admindash/testimonialmain"); 
  };

  // Reset form
  const handleReset = () => {
    setForm({
      name: "",
      location: "",
      description: "",
      fileType: "profile-image",
      file: null,
      videoLink: "",
      youtubeLink: "",
      rating: 1,
      status: "active",
    });
    setPreview(null);
  };

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      <div className="m-4 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#2c0a4d] mb-6">Add New Testimonial</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Name & Location */}
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
                  placeholder="Enter your name"
                  className="w-full outline-none border-0 bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">Location</label>
              <div className="flex items-center gap-2 border border-gray-400 rounded-xl p-1">
                <img src="/admin-img/location.png" alt="location" className="input-img-side" />
                <CustomInput
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter your location"
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
                placeholder="Enter Description"
                required
              />
            </div>
          </div>

          {/* File Type & File / Video */}
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
                <>
                  <CustomInput
                    type="file"
                    name="file"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
                    required
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover mt-2 rounded"
                    />
                  )}
                </>
              ) : (
                <CustomInput
                  type="text"
                  name="videoLink"
                  value={form.videoLink}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
                  placeholder="Enter video link here"
                  required
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
              placeholder="Enter Youtube link here"
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
                required
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
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 items-center justify-center mt-4">
            <CustomButton type="submit" variant="green" className="bg-[#2c0a4d] text-white px-6 py-2">
              {loading ? "Submitting..." : "SUBMIT"}
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
