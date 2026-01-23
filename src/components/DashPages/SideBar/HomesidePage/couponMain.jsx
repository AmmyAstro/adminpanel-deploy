"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import {
  createCouponRequest,
  fetchCouponsRequest,
  deleteCouponRequest,
  updateCouponRequest,
  resetCode
} from "@/app/redux/slices/couponSlice";

import toast from "react-hot-toast";
import AlertLoading from "@/app/common/AlertLoading";

export default function CouponMain() {
  const [isCoupOpen, setCoupOpen] = useState(false);

  const [editCoupon, setEditCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { coupons, addCode, loading } = useSelector((state) => state.coupon);



  useEffect(() => {
    dispatch(fetchCouponsRequest());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };


  useEffect(() => {
    if (addCode === 200) {
      toast.success("New Coupon Add Successfully");
      dispatch(resetCode());
      handleCloseModal();
    }

  }, [addCode])


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


  const handleChange = (key, value) => {

    setCoupon((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleSubmit = () => {
    dispatch(createCouponRequest({
      couponCode: coupon.code,
      coupon_desc: coupon.description,
      apply_on: coupon.applicable,
      coupon_type: coupon.type,

      flat_discount: Number(coupon.percentage) || null,
      max_discount: Number(coupon.max_discount) || null,
      redeem_limit: Number(coupon.redeem_limit) || null,

      coupon_start_date: coupon.start_date || null,
      coupon_end_date: coupon.end_date || null,

      status: coupon.status,        
      visibility: coupon.visibility,  
    }));

    setCoupOpen(false);
  };

  // const handleDelete = (id) => {
  //   if (confirm("Are you sure to delete this coupon?")) {
  //     dispatch(deleteCouponRequest(id));
  //     toast.success("Coupon deleted successfully!");
  //   }
  // };

  const handleCloseModal = () => {
    setCoupOpen(false);
    setEditCoupon(null);

  };

  // const handleReset = () => {

  // };


  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      {isCoupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg flex flex-col gap-3 shadow-lg w-[60%] p-6">
            <div className="flex items-center justify-between font-semibold border-b py-5 bg-[#7a5ba3] rounded-full text-white px-4">
              <h3 className="text-lg font-semibold">
                {editCoupon ? "Edit Coupon" : "Add New Coupon"}
              </h3>
              <button onClick={handleCloseModal}>
                <MdCancel className="text-2xl text-gray-100 hover:text-red-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                <div>
                  <label className="block text-sm font-medium">Applicable On</label>
                  <select
                    name="apply_on"
                    required
                    value={coupon.coupon_mode}
                    onChange={(e) => handleChange("coupon_mode", e.target.value)}

                    className="mt-1 block w-full rounded-full border border-gray-300 p-2 text-sm"
                  >
                    <option value="1">Manual</option>
                    <option value="2">AutoMatic</option>
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium">Coupon Code</label>
                  <CustomInput
                    type="text"
                    name="coupon_code"
                    required
                    value={coupon.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                    placeholder="Coupon Code"
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Coupon Description</label>
                  <CustomInput
                    type="text"
                    name="coupon_desc"
                    required
                    value={coupon.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Coupon Description"
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

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


                <div>
                  <label className="block text-sm font-medium">Cashback / Flat Discount (%)</label>
                  <CustomInput
                    type="number"
                    name="percentage"
                    required
                    value={coupon.percentage}
                    onChange={(e) => handleChange("percentage", e.target.value)}
                    placeholder="Cashback / Flat Discount (%)"
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm no-spinner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Max Discount (Upto Rs)</label>
                  <CustomInput
                    type="number"
                    name="max_discount"


                    value={coupon.max_discount}
                    onChange={(e) => handleChange("max_discount", e.target.value)}
                    placeholder="Max Discount (Upto Rs)"
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm no-spinner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Redeem Limit Per User</label>
                  <CustomInput
                    type="number"
                    name="redeem_limit"

                    value={coupon.redeem_limit}
                    onChange={(e) => handleChange("redeem_limit", e.target.value)}
                    placeholder="Redeem Limit Per User"
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium"> Start Date</label>
                  <CustomInput
                    type="date"
                    value={coupon.start_date}
                    onChange={(e) => handleChange("start_date", e.target.value)}

                    className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium"> End Date</label>
                  <CustomInput
                    type="date"
                    name="coupon_end_date"
                    value={coupon.end_date}
                    onChange={(e) => handleChange("end_date", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Visibility</label>
                  <select
                    name="visibility"
                    value={coupon.visibility}
                    onChange={(e) => handleChange("visibility", e.target.value)}
                    className="mt-1 block w-full rounded-full border border-gray-300 p-2 text-sm"
                  >
                    <option value="1" >Visible</option>
                    <option value="2">Not Visible</option>
                  </select>
                </div>

              </div>

              {/* Buttons */}
              <div className="flex gap-6 items-center justify-center mt-6">
                <CustomButton variant={"green"} onClick={handleSubmit}
                  type="submit" className="px-3 py-1">
                  Submit
                </CustomButton>
                {/* <CustomButton variant={"gray"} onClick={handleReset} className="px-3 py-1">
                  Reset
                </CustomButton> */}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Manage Coupons</h3>
          <CustomButton variant={"green"} onClick={() => setCoupOpen(true)} className="px-3 py-1">
            Add New Coupon
          </CustomButton>
        </div>

        <hr className="mb-6" />

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by code, description, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-full placeholder:text-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>


        {/* <div className="couplist text-gray-600">
          {filteredCoupons.length > 0 ? (
            <>
              <div className="grid grid-cols-8 gap-2 font-semibold text-sm rounded-2xl border-b bg-purple-300 p-2 text-gray-600">
                <div className="col-span-1 text-center">Sr No</div>
                <div className="col-span-1 text-center">Code</div>
                <div className="col-span-1 text-center">Description</div>
                <div className="col-span-1 text-center">Type</div>
                <div className="col-span-1 text-center">Discount</div>
                <div className="col-span-1 text-center">Start Date</div>
                <div className="col-span-1 text-center">End Date</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>

             
              {paginatedCoupons.map((coupon, index) => (
                <div
                  key={coupon.id}
                  className="grid grid-cols-8 gap-2 border-b p-2 text-sm items-center hover:bg-gray-50 text-gray-600">
                  <div className="col-span-1 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </div>
                  <div className="col-span-1 text-center">{coupon.coupon_code}</div>
                  <div className="col-span-1 text-center">{coupon.coupon_desc}</div>
                  <div className="col-span-1 text-center">{coupon.coupon_type}</div>
                  <div className="col-span-1 text-center">{coupon.flat_discount}</div>
                  <div className="col-span-1 text-center">
                    {coupon.coupon_start_date
                      ? new Date(coupon.coupon_start_date).toLocaleDateString("en-IN")
                      : "-"}
                  </div>
                  <div className="col-span-1">
                    {coupon.coupon_end_date
                      ? new Date(coupon.coupon_end_date).toLocaleDateString("en-IN")
                      : "-"} 
                  </div>
                  <div className="col-span-1 flex gap-4 text-center items-center justify-center">
                    <button
                      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 cursor-pointer"
                      onClick={() => handleEdit(coupon)}>
                      <FiEdit size={18} />
                    </button>
                    <CustomToggle
                      checked={statusMap[coupon.id]}
                      onChange={(val) => {
                        setStatusMap(prev => ({ ...prev, [coupon.id]: val })); // update locally

                        // update in DB via Redux
                        dispatch(updateCouponRequest({
                          id: coupon.id,
                          data: { ...coupon, status: val ? "active" : "inactive" }
                        }));
                      }}
                    />

                  </div>
                </div>
              ))}
 

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <CustomButton
                    variant="gray"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2">
                    Previous
                  </CustomButton>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <CustomButton
                    variant="gray"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2"
                  >
                    Next
                  </CustomButton>
                </div>
              )}
            </>
          ) : (
            <p>{searchTerm ? "No matching coupons found." : "No coupons available."}</p>
          )}
        </div> 
        */}


      </div>
      <AlertLoading show={loading} title="Please Wait...." />
    </div>
  );
}