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
} from "@/app/redux/slices/couponSlice";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

export default function CouponMain() {
  const [isCoupOpen, setCoupOpen] = useState(false);
  const [form, setForm] = useState({
    coupon_code: "",
    coupon_desc: "",
    apply_on: "recharge",
    coupon_type: "cashback",
    flat_discount: "",
    max_discount: "",
    redeem_limit: "",
    coupon_validity: "",
    coupon_start_date: "",
    coupon_end_date: "",
    visibility: "visible",
    status: "active",
  });
  const [editCoupon, setEditCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { coupons } = useSelector((state) => state.coupon);
  const itemsPerPage = 10;

  const initialForm = {
    coupon_code: "",
    coupon_desc: "",
    apply_on: "recharge",
    coupon_type: "cashback",
    flat_discount: "",
    max_discount: "",
    redeem_limit: "",
    coupon_validity: "",
    coupon_start_date: "",
    coupon_end_date: "",
    visibility: "visible",
    status: "active",
  };

  // Memoized filtered coupons
  const filteredCoupons = useMemo(() => {
    if (!coupons) return [];
    return coupons.filter(
      (coupon) =>
        coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.coupon_desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.coupon_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coupons, searchTerm]);

  // Memoized pagination
  const totalPages = useMemo(
    () => Math.ceil(filteredCoupons.length / itemsPerPage),
    [filteredCoupons.length, itemsPerPage]
  );

  const indexOfLastItem = useMemo(
    () => currentPage * itemsPerPage,
    [currentPage, itemsPerPage]
  );
  const indexOfFirstItem = useMemo(
    () => indexOfLastItem - itemsPerPage,
    [indexOfLastItem, itemsPerPage]
  );
  const paginatedCoupons = useMemo(
    () => filteredCoupons.slice(indexOfFirstItem, indexOfLastItem),
    [filteredCoupons, indexOfFirstItem, indexOfLastItem]
  );

  useEffect(() => {
    dispatch(fetchCouponsRequest());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      flat_discount: parseFloat(form.flat_discount || 0),
      max_discount: parseFloat(form.max_discount || 0),
      redeem_limit: parseInt(form.redeem_limit || 0),
      coupon_validity: parseInt(form.coupon_validity || 0),
      coupon_start_date: form.coupon_start_date || null,
      coupon_end_date: form.coupon_end_date || null,
    };

    if (editCoupon) {
      dispatch(updateCouponRequest({ id: editCoupon.id, data: payload }));
      toast.success("Coupon updated successfully!");
    } else {
      dispatch(createCouponRequest(payload));
      toast.success("Coupon created successfully!");
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure to delete this coupon?")) {
      dispatch(deleteCouponRequest(id));
      toast.success("Coupon deleted successfully!");
    }
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setForm({
      ...coupon,
      coupon_start_date: formatDate(coupon.coupon_start_date),
      coupon_end_date: formatDate(coupon.coupon_end_date),
    });
    setCoupOpen(true);
  };

  const handleCloseModal = () => {
    setCoupOpen(false);
    setEditCoupon(null);
    setForm(initialForm);
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Coupon Code & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Coupon Code</label>
                  <CustomInput
                    type="text"
                    name="coupon_code"
                    required
                    value={form.coupon_code}
                    onChange={handleChange}
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
                    value={form.coupon_desc}
                    onChange={handleChange}
                    placeholder="Coupon Description"
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Apply On & Coupon Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Applicable On</label>
                  <select
                    name="apply_on"
                    required
                    value={form.apply_on}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
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
                  value={form.coupon_type}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                  >
                    <option value="cashback">Cashback</option>
                    <option value="flat_discount">Flat Discount</option>
                  </select>
                </div>
              </div>

              {/* Discount & Max Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Cashback / Flat Discount</label>
                  <CustomInput
                    type="number"
                    name="flat_discount"
                    required
                    value={form.flat_discount}
                    onChange={handleChange}
                    placeholder="Cashback / Flat Discount"
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Max Discount</label>
                  <CustomInput
                    type="number"
                    name="max_discount"
                    value={form.max_discount}
                    onChange={handleChange}
                    placeholder="Max Discount"
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                  />
                </div>
              </div>

              {/* Redeem Limit & Coupon Validity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Redeem Limit Per User</label>
                  <CustomInput
                    type="number"
                    name="redeem_limit"
                    value={form.redeem_limit}
                    onChange={handleChange}
                    placeholder="Redeem Limit Per User"
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Coupon Validity (Days)</label>
                  <CustomInput
                    type="number"
                    name="coupon_validity"
                    value={form.coupon_validity}
                    onChange={handleChange}
                    placeholder="Coupon Validity"
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Coupon Start Date</label>
                  <CustomInput
                    type="date"
                    name="coupon_start_date"
                    value={form.coupon_start_date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Coupon End Date</label>
                  <CustomInput
                    type="date"
                    name="coupon_end_date"
                    value={form.coupon_end_date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                  />
                </div>
              </div>

              {/* Visibility & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Visibility</label>
                  <select
                    name="visibility"
                    value={form.visibility}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                  >
                    <option value="visible">Visible</option>
                    <option value="not_visible">Not Visible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-6 items-center justify-center mt-6">
                <CustomButton variant={"green"} type="submit" className="px-3 py-1">
                  Submit
                </CustomButton>
                <CustomButton variant={"gray"} onClick={handleReset} className="px-3 py-1">
                  Reset
                </CustomButton>
              </div>
            </form>
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
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="couplist text-gray-600">
          {filteredCoupons.length > 0 ? (
            <>
              <table className="w-full border border-gray-300 rounded-lg text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border-b">Sr No</th>
                    <th className="p-2 border-b">Code</th>
                    <th className="p-2 border-b">Description</th>
                    <th className="p-2 border-b">Type</th>
                    <th className="p-2 border-b">Apply On</th>
                    <th className="p-2 border-b">Discount</th>
                    <th className="p-2 border-b">Max Discount</th>
                    <th className="p-2 border-b">Coupon Start Date</th>
                    <th className="p-2 border-b">Coupon End Date</th>
                    <th className="p-2 border-b">Validity</th>
                    <th className="p-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCoupons.map((coupon, index) => (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="p-2 border-b">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-2 border-b">{coupon.coupon_code}</td>
                      <td className="p-2 border-b">{coupon.coupon_desc}</td>
                      <td className="p-2 border-b">{coupon.coupon_type}</td>
                      <td className="p-2 border-b">{coupon.apply_on}</td>
                      <td className="p-2 border-b">{coupon.flat_discount}</td>
                      <td className="p-2 border-b">{coupon.max_discount}</td>
                      <td className="p-2 border-b">
                        {coupon.coupon_start_date
                            ? new Date(coupon.coupon_start_date).toLocaleString("en-IN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                                timeZone: "Asia/Kolkata",
                            })
                            : "-"}
                        </td>
                        <td className="p-2 border-b">
                        {coupon.coupon_end_date
                            ? new Date(coupon.coupon_end_date).toLocaleString("en-IN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                                timeZone: "Asia/Kolkata",
                            })
                            : "-"}
                        </td>
                      <td className="p-2 border-b">{coupon.coupon_validity} days</td>
                      <td className="p-2 border-b flex gap-2">
                        <button
                          className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                          onClick={() => handleEdit(coupon)}
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <CustomButton
                    variant="gray"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2"
                  >
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
      </div>
    </div>
  );
}