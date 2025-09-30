"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestimonialRequest,
  updateTestimonialRequest,
} from "@/app/redux/slices/testimonialSlice";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditTestimonialPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentTestimonial: testimonial, loading, error } = useSelector(
    (state) => state.testimonial || {}
  );

  const [isUpdated, setIsUpdated] = useState(false);
  const [preview, setPreview] = useState(null);

  const initialFormState = {
    name: "",
    location: "",
    description: "",
    fileType: "profile-image",
    file: null,
    videoLink: "",
    youtubeLink: "",
    rating: 1,
    status: "active",
  };

  const [form, setForm] = useState(initialFormState);

  // Fetch testimonial
  useEffect(() => {
    if (id) dispatch(fetchTestimonialRequest(id));
  }, [dispatch, id]);

  // Populate form when testimonial is loaded
  const populateForm = useCallback(() => {
    if (!testimonial) return;

    const populated = {
      name: testimonial.name || "",
      location: testimonial.location || "",
      description: testimonial.description || "",
      fileType: testimonial.fileType || "profile-image",
      file: null,
      videoLink: testimonial.fileType === "video-link" ? testimonial.fileUrl || "" : "",
      youtubeLink: testimonial.youtubeLink || "",
      rating: testimonial.rating || 1,
      status: testimonial.status || "active",
    };

    setForm(populated);

    if (testimonial.fileType === "profile-image" && testimonial.fileUrl) {
      const fileUrl = testimonial.fileUrl.replace(/\\/g, "/");
     setPreview(`${BASE_URL}/${fileUrl}`);
    } else {
      setPreview(null);
    }
  }, [testimonial]);

  useEffect(() => populateForm(), [populateForm]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const payload = { ...form, rating: Number(form.rating) };

    if (payload.fileType === "profile-image" && payload.file) {
      formData.append("file", payload.file);
    } else if (payload.fileType === "video-link") {
      formData.append("fileUrl", payload.videoLink || "");
    }
    ["name", "location", "description", "fileType", "youtubeLink", "rating", "status"].forEach(
      (field) => formData.append(field, payload[field] ?? "")
    );
    dispatch(updateTestimonialRequest({ id, formData }));
    setIsUpdated(true);
  };

  const handleReset = () => populateForm();
  useEffect(() => {
    if (isUpdated && !loading && !error) {
      toast.success("Testimonial updated successfully!");
      router.push("/Admindash/testimonialmain");
    }
  }, [isUpdated, loading, error, router]);

  if (!testimonial) return <p>Loading testimonial...</p>;

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      <div className="m-4 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#2c0a4d] mb-6">Edit Testimonial</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Name & Location */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {["name", "location"].map((field) => (
              <div key={field} className="flex flex-col w-full">
                <label className="text-sm font-medium mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <div className="flex items-center gap-2 border border-gray-400 rounded-xl px-2 p-1">
                  <img src={`/admin-img/${field === "name" ? "userte" : "location"}.png`} alt={field} className="input-img-side" />
                  <CustomInput
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full outline-none border-0 bg-transparent"
                    required
                  />
                </div>
              </div>
            ))}
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
              />
            </div>
          </div>

          {/* File Type & File/Video */}
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
              <label className="text-sm font-medium mb-1">{form.fileType === "video-link" ? "Video Link" : "Profile Image"}</label>
              {form.fileType === "profile-image" ? (
                <>
                  <CustomInput
                    type="file"
                    name="file"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
                  />
                  {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded" />}
                </>
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
            {["rating", "status"].map((field) => (
              <div key={field} className="flex flex-col w-full">
                <label className="text-sm font-medium mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <select
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-xl p-1 outline-none bg-transparent"
                >
                  {field === "rating"
                    ? [1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}</option>)
                    : ["active", "inactive"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
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
