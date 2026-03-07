"use client";

import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import { useState } from "react";
import toast from "react-hot-toast";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomToggle from "@/components/Custom/CustomToggle";


import {
  GET_COUPONS,
  CREATE_COUPON,
  DELETE_COUPON,
  UPDATE_COUPON_STATUS
} from "../../../../app/graphQL/coupon";
import { useMutation, useQuery } from "@apollo/client/react";

export default function CouponMain() {

  const [isCoupOpen, setCoupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [coupon, setCoupon] = useState({
    code: "",
    description: "",
    applicable: "recharge",
    type: "cashback",
    status: "active",
    visibility: "visible",
    percentage: 0,
    max_discount: 0,
    redeem_limit: 0,
    start_date: "",
    end_date: "",
  });


  const { data, loading, refetch } = useQuery(GET_COUPONS);

  const [createCoupon] = useMutation(CREATE_COUPON);
  const [deleteCoupon] = useMutation(DELETE_COUPON);
  const [updateStatus] = useMutation(UPDATE_COUPON_STATUS);

  const coupons = data?.coupons || [];

  const handleChange = (key, value) => {
    setCoupon(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async () => {

    try {

      await createCoupon({
        variables: {
          input: {
            code: coupon.code,
            description: coupon.description,
            applicable: coupon.applicable,
            type: coupon.type,
            status: coupon.status,
            visibility: coupon.visibility,
            percentage: coupon.percentage
              ? Number(coupon.percentage)
              : null,
            max_discount: coupon.max_discount
              ? Number(coupon.max_discount)
              : null,
            redeem_limit: coupon.redeem_limit
              ? Number(coupon.redeem_limit)
              : null,
            start_date: coupon.start_date,
            end_date: coupon.end_date
          }
        }
      });

      toast.success("Coupon Added Successfully");

      setCoupOpen(false);

      refetch();

    } catch (err) {

      toast.error(err.message);

    }
  };

  const handleDelete = async (id) => {

    if (!confirm("Are you sure to delete this coupon?")) return;

    try {

      await deleteCoupon({
        variables: { id }
      });

      toast.success("Coupon Deleted Successfully");

      refetch();

    } catch (err) {

      toast.error(err.message);

    }

  };

  const handleStatusToggle = async (id, value) => {

    try {

      await updateStatus({
        variables: {
          id,
          status: value ? "active" : "inactive"
        }
      });

      refetch();

    } catch (err) {

      toast.error(err.message);

    }

  };

  if (loading) return <p>Loading coupons...</p>;

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">

      {/* Modal */}
      {isCoupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

          <div className="bg-white rounded-lg flex flex-col gap-3 shadow-lg w-[60%] p-6">

            <div className="flex items-center justify-between font-semibold border-b py-5 bg-[#7a5ba3] rounded-full text-white px-4">

              <h3>Add New Coupon</h3>

              <button onClick={() => setCoupOpen(false)}>
                <MdCancel className="text-2xl" />
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <CustomInput
                label="Coupon code"
                type="text"
                value={coupon.code}
                placeholder="Coupon Code"
                onChange={(e) => handleChange("code", e.target.value)}
              />

              <CustomInput
                type="text"
                label="Description"
                value={coupon.description}
                placeholder="Description"
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium">Applicable On</label>
                <select
                  name="apply_on"
                  required
                  value={coupon.applicable}
                  onChange={(e) => handleChange("applicable", e.target.value)}

                  className="mt-1 block w-full rounded-full border border-gray-300 p-2 text-sm"
                >
                  <option value="recharge">Recharge</option>
                  <option value="product">Product</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Coupon Type</label>
                <select
                  name="coupon_type"
                  required

                  value={coupon.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="mt-1 block w-full rounded-full border border-gray-300 p-2 text-sm"
                >
                  <option value="cashback">Cashback</option>
                  <option value="flat_discount">Flat Discount</option>
                </select>
              </div>

              <CustomInput
                type="number"
                label="Cashback / Flat Discount (%)"
                value={coupon.percentage}
                placeholder="Discount %"
                onChange={(e) => handleChange("percentage", e.target.value)}
              />

              <CustomInput
                type="number"
                label="Max Discount (Upto Rs)"
                value={coupon.max_discount}
                placeholder="Max Discount"
                onChange={(e) => handleChange("max_discount", e.target.value)}
              />

              <CustomInput
                type="number"
                label="Redeem Limit Per User"
                value={coupon.redeem_limit}
                placeholder="Redeem Limit"
                onChange={(e) => handleChange("redeem_limit", e.target.value)}
              />

              <CustomInput
                type="date"
                label="Start Date"
                value={coupon.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />

              <CustomInput
                type="date"
                label="End Date"
                value={coupon.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium">Visibility</label>
                <select
                  name="visibility"
                  value={coupon.visibility}
                  onChange={(e) => handleChange("visibility", e.target.value)}
                  className="mt-1 block w-full rounded-full border border-gray-300 p-2 text-sm"
                >
                  <option value="visible" >Visible</option>
                  <option value="not_visible">Not Visible</option>
                </select>
              </div>

            </div>

            <div className="flex justify-center mt-4">

              <CustomButton variant="green" onClick={handleSubmit}>
                Submit
              </CustomButton>

            </div>

          </div>

        </div>
      )}

      {/* Main Panel */}

      <div className="bg-white shadow-md rounded-xl p-6">

        <div className="flex items-center justify-between mb-4">

          <h3 className="text-lg font-semibold">Manage Coupons</h3>

          <CustomButton variant="green" onClick={() => setCoupOpen(true)}>
            Add New Coupon
          </CustomButton>

        </div>

        <input
          type="text"
          placeholder="Search coupons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-full p-2 mb-4"
        />

        <div className="grid grid-cols-8 gap-2 bg-purple-300 p-2 font-semibold text-sm">

          <div className="text-center">#</div>
          <div className="text-center">Code</div>
          <div className="text-center">Description</div>
          <div className="text-center">Type</div>
          <div className="text-center">Discount</div>
          <div className="text-center">Start</div>
          <div className="text-center">End</div>
          <div className="text-center">Actions</div>

        </div>

        {coupons
          .filter(c =>
            c.code.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((c, index) => (

            <div
              key={c.id}
              className="grid grid-cols-8 gap-2 border-b p-2 items-center text-sm"
            >

              <div className="text-center">{index + 1}</div>
              <div className="col-span-1 text-center">{c.code}</div>

              <div className="col-span-1 text-center">{c.description}</div>

              <div className="col-span-1 text-center">{c.type}</div>

              <div className="col-span-1 text-center">{c.percentage}</div>

              <div className="col-span-1 text-center">
                {new Date(c.start_date).toLocaleDateString("en-IN")}
              </div>

              <div className="col-span-1 text-center">
                {new Date(c.end_date).toLocaleDateString("en-IN")}
              </div>

              <div className="flex gap-2 justify-center">

                <button className="px-2 py-1 bg-yellow-400 rounded">
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-2 py-1 bg-red-400 text-white rounded"
                >
                  <MdDelete />
                </button>

                <CustomToggle
                  checked={coupon.status}
                  onChange={(val) =>
                    handleStatusToggle(
                      coupon.id,
                      val ? "active" : "inactive"
                    )
                  }
                />

              </div>

            </div>

          ))}

      </div>

    </div>
  );
}