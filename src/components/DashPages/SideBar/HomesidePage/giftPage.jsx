"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  addGiftRequest,
  fetchGiftRequest,
} from "@/app/redux/slices/addGiftSlice";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import CustomInput from "@/components/Custom/CustomInput";
import { useEffect, useState } from "react";

export default function Giftpage() {
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    status: "",
    // image: null,
  });


  useEffect(() => { dispatch(fetchGiftRequest()); }, [dispatch]);
  const reduxState = useSelector(state => state.gift.list.data);

  useEffect(() => {
    console.log("Redux state changed:", reduxState);
  }, [reduxState]);


  const gifts = useSelector(state => state.gift.list.data);
  const loading = useSelector(state => state.gift.list.loading);
  const error = useSelector(state => state.gift.list.error);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    dispatch(addGiftRequest({ formData }));
    setFormData({
      title: "",
      amount: "",
      status: "",
    });
    setShowForm(false);
    toast.success("Banner added successfully!");

  };

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="heading-banner">Gifts</h3>
        <CustomButton
          variant={"green"}
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
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
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
            <CustomButton
              variant={"green"}
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2  hover:bg-green-700"
            >
              Submit
            </CustomButton>
            <CustomButton
              variant={"gray"}
              type="button"
              // onClick={handleSubmit}
              className="px-4 py-2  hover:bg-gray-500"
            >
              Cancel
            </CustomButton>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h5 className="text-lg font-semibold mb-4">Gift List</h5>

        {loading && <p>Loading...</p>}

        {!loading && Array.isArray(gifts) && gifts.length === 0 && (
          <p className="text-gray-500">No gifts found</p>
        )}

        <div className="grid grid-cols-4">
          {Array.isArray(gifts) &&
            gifts.map((gift) => (
              <div
                key={gift.id}
                className=" last:border-b-0 pb-3 mb-3"
              >
                <h4 className="font-medium">{gift.title}</h4>
                <p>Amount: ₹{gift.amount}</p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      gift.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {gift.status === "active" ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            ))}
        </div>
      </div>


    </div>
  );
}
