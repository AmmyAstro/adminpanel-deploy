"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { 
  addTestimonialRequest, 
  addTestimonialSuccess, 
  addTestimonialFailure 
} from "@/app/redux/slices/testimonialSlice";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function AddTestimonial() {
  const router = useRouter();
  const dispatch = useDispatch();
  const BASE_URL = "http://localhost:5000/api/testimonials";

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    fileType: "profile-image",
    file: "",
    videoLink: "",
    youtubeLink: "",
    rating: 1,
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Append file or video link properly
      Object.keys(form).forEach((key) => {
      if (key === "file" && form[key]) {
        formData.append(key, form[key]);
      } else if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    const serializableData = {
      name: form.name,
      location: form.location,
      description: form.description,
      fileType: form.fileType,
      youtubeLink: form.youtubeLink,
      rating: form.rating,
      status: form.status,
      fileName: form.file ? form.file.name : null,
    };

    try {
      // Optional: dispatch request action for loading state
      dispatch(addTestimonialRequest(serializableData));

      const response = await axios.post(
        `${BASE_URL}/add`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch(addTestimonialSuccess(response.data.testimonial));
      handleReset();
      router.push("/Admindash/testimonialmain");
    } catch (err) {
      dispatch(addTestimonialFailure(err.response?.data?.message || err.message));
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      location: "",
      description: "",
      fileType: "profile-image", // reset to default
      file: null,
      youtubeLink: "",
      rating: 1,
      status: "active",
    });
  };

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      <div className="m-4 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#2c0a4d] mb-6">
          Add New Testimonial
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Name and Location */}
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
                  placeholder="Enter your name here"
                  className="w-full outline-none border-0 border-none bg-transparent"
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
                  placeholder="Enter your location here"
                  className="w-full outline-none border-0 border-none bg-transparent"
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
              ></textarea>
            </div>
          </div>

          {/* File Type and File/Video Link */}
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
                  className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
                  accept="image/*"
                />
              ) : (
                <CustomInput
                  type="text"
                  name="videoLink"
                  value={form.videoLink || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
                  placeholder="Enter video link here"
                />
              )}
            </div>
          </div>

          {/* Youtube Link (always separate) */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-1">Youtube Link</label>
            <CustomInput
              type="text"
              name="youtubeLink"
              value={form.youtubeLink}
              onChange={handleChange}
              placeholder="Enter youtube link here"
              className="w-full border border-gray-400 rounded-xl p-1 outline-none"
            />
          </div>
          {/* Rating and Status */}
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
            <CustomButton
              type="submit"
              variant={"green"}
              className="bg-[#2c0a4d] text-white px-6 py-2 transition"
            >
              SUBMIT
            </CustomButton>
            <CustomButton
              type="button"
              variant={"gray"}
              onClick={handleReset}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
            >
              Reset
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}
