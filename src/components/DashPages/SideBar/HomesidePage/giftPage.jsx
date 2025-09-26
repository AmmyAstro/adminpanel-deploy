"use client";
import { useDispatch } from "react-redux";
import { addGiftRequest } from "@/app/redux/slices/addGiftSlice";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import CustomInput from "@/components/Custom/CustomInput";
import { useState } from "react";


export default function Giftpage() {
    const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: 0,
    status: "",
    // image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // if (name === "image") {
    //   setFormData({ ...formData, image: files[0] });
    // } else {
    //   setFormData({ ...formData, [name]: value });
    // }
        setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    dispatch(addGiftRequest({ formData }));
       console.log("asaS", formData);
  };

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="heading-banner">Gifts</h3>
        <CustomButton variant={"green"}
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-white  "
        >
          Add New Gift
        </CustomButton>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg flex flex-col gap-5 shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <CustomInput
                label="Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className=" p-2 outline-none"
                placeholder="Enter gift title"
                required
              />
            </div>

            <div className="flex flex-col">
              <CustomInput
                label="Amount"
                  type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="  p-2 outline-none"
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="flex flex-col">

              <CustomDropdown
                label="Status"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                options={[
                  { value: "ac", label: "Active" },
                  { value: "in", label: "Inactive" },
                ]}
              />
            </div>
            {/* <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
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

            </div> */}
          </div>


          <div className="flex gap-4">
            <CustomButton variant={"green"}
              type="submit" 
              onClick={handleSubmit}
              className="px-4 py-2  hover:bg-green-700" >
              Submit
            </CustomButton>
            <CustomButton variant={"gray"}
              type="button"
              // onClick={handleSubmit}
              className="px-4 py-2  hover:bg-gray-500" >
              Cancel
            </CustomButton>
          </div>
        </div>
      )}

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
