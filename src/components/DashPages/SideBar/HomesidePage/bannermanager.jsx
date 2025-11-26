"use client";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import { sendbannerRequest } from "@/app/redux/slices/bannerSlice";
import toast from "react-hot-toast";

// Debounce helper
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function BannerManager() {
  const dispatch = useDispatch();
  const { response, loading } = useSelector((state) => state.banner);

  const [isOpen, setIsOpen] = useState(false);

  const [tempData, setTempData] = useState({
    heading: "",
    subheading: "",
    slug: "",
    sortorder: "",
    bannerlink: "",
    language: "en",
    imageUrl: "hello",
  });

  const formData = useDebounce(tempData, 600);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setTempData((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? files[0]
          : name === "sortorder"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = () => {
    console.log("SUBMITTING FORM", formData);
    dispatch(sendbannerRequest({ formData }));
    setIsOpen(false);
    toast.success("Banner added successfully!");
  };

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      {isOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] p-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h6 className="text-lg text-center font-semibold">
                Enter Banner Details :
              </h6>
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
                  value={tempData.language}
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
                  value={tempData.heading}
                  onChange={handleChange}
                  required
                  placeholder="Enter main banner heading"
                />

                <CustomInput
                  label="Sub Heading"
                  type="text"
                  id="subheading"
                  name="subheading"
                  value={tempData.subheading}
                  onChange={handleChange}
                  required
                  placeholder="Enter banner sub heading"
                />

                <CustomInput
                  label="Banner Link"
                  type="text"
                  id="bannerlink"
                  name="bannerlink"
                  value={tempData.bannerlink}
                  onChange={handleChange}
                  required
                  placeholder="Enter banner link"
                />

                <CustomInput
                  label="Sort Order"
                  type="number"
                  id="sortorder"
                  name="sortorder"
                  value={tempData.sortorder}
                  onChange={handleChange}
                  required
                  placeholder="Enter sort order"
                />

                <CustomInput
                  label="Slug"
                  type="text"
                  id="slug"
                  name="slug"
                  value={tempData.slug}
                  onChange={handleChange}
                  required
                  placeholder="Enter slug"
                />
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
      </div>
    </div>
  );
}
