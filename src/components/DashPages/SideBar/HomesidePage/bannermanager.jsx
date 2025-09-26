"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { TbEdit } from "react-icons/tb";
import { MdDelete, MdCancel } from "react-icons/md";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import { sendbannerRequest } from "@/app/redux/slices/bannerSlice";


export default function BannerManager() {
  const dispatch = useDispatch();
  const { response, loading } = useSelector((state) => state.banner);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    slug: "",
    sortorder: 0,
    bannerlink: "",
    // image: null,
    language: "en",
    imageUrl: "hello"
  });



  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sortorder" ? Number(value) : value, 
    }));
  };

  const handleSubmit = () => {
    dispatch(sendbannerRequest({ formData }));
    console.log("asaS", formData);

  };




  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      {isOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] p-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h6 className="text-lg font-semibold">Add Banner Image</h6>
              <CustomButton onClick={() => setIsOpen(false)}>
                <MdCancel className="text-2xl text-gray-600 hover:text-red-500" />
              </CustomButton>
            </div>

            <div className="space-y-4 flex flex-col">
              <div className="grid grid-cols-2 gap-4">
                <CustomDropdown
                  label="Language"
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  options={[
                    { value: "en", label: "English" },
                    { value: "hi", label: "Hindi" },
                  ]}
                />

                <CustomInput
                  label="Heading"
                  type="text"
                  id="heading"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  required
                  placeholder="Enter main banner heading"
                />

                <CustomInput
                  label="Sub Heading"
                  type="text"
                  id="subheading"
                  name="subheading"
                  value={formData.subheading}
                  onChange={handleChange}
                  required
                  placeholder="Enter banner sub heading"
                />

                <CustomInput
                  label="Banner Link"
                  type="text"
                  id="bannerlink"
                  name="bannerlink"
                  value={formData.bannerlink}
                  onChange={handleChange}
                  required
                  placeholder="Enter banner link"
                />

                <CustomInput
                  label="Sort Order"
                  type="number"
                  id="sortorder"
                  name="sortorder"
                  value={formData.sortorder}
                  onChange={handleChange}
                  required
                  placeholder="Enter sort order"
                />

                <CustomInput
                  label="Slug"
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="Enter slug"
                />

                {/* <div>
                  <CustomInput
                    label="Image"
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleChange}
                    required
                  />
                  <small className="text-xs text-red-500">
                    *NOTE: Maximum upload limit 1MB
                  </small>
                </div> */}
              </div>

              <div className="flex justify-center">
                <CustomButton
                  variant="green"
                  onClick={handleSubmit}

                  className="w-fit px-10 rounded-full bg-purple-600 text-white py-2 font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                >
                  Submit
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center p-4">
        <h3 className="heading-banner">Manage Banners</h3>
        <CustomButton
          variant="green"
          onClick={() => setIsOpen(true)}
          className="px-3 py-1"
        >
          Add New Banner
        </CustomButton>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="grid grid-cols-6 place-items-center font-semibold border-b py-5 bg-[#7a5ba3] rounded-lg text-white px-4">
          <div>S.no</div>
          <div>Banner Name</div>
          <div>Language</div>
          <div>Banner Image</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* {banners?.map((banner, i) => (
          <div
            key={banner.id}
            className="grid grid-cols-6 items-center place-items-center border-b border-purple-300 py-4 px-5 text-sm bg-[#9f83c430] rounded-lg"
          >
            <div>{i + 1}</div>
            <div>{banner.heading}</div>
            <div>{banner.language}</div>

            <div>
              <Image
                src={banner.image}
                alt={banner.heading}
                width={200}
                height={80}
                className="rounded-lg"
              />
            </div>

            <div>
              <input
                type="checkbox"
                checked={banner.status}
                onChange={() =>
                  dispatch(
                    updateBannerRequest({ ...banner, status: !banner.status })
                  )
                }
                className="w-4 h-4 accent-blue-600"
              />
            </div>

            <div className="flex gap-2">
              <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                <TbEdit className="text-blue-800" />
              </button>
              <button
                onClick={() => dispatch(deleteBannerRequest(banner.id))}
                className="p-2 bg-red-400 text-white rounded-md hover:bg-red-500"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}
