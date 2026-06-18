"use client";

import { MdDelete, MdCancel } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { useState } from "react";
import toast from "react-hot-toast";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomToggle from "@/components/Custom/CustomToggle";

import {
  GET_COUPONS,
  CREATE_COUPON,
  DELETE_COUPON,
  UPDATE_COUPON_STATUS,
} from "../../../../app/graphQL/coupon";

import { usePermissions } from "@/context/PermissionContext";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import { useActionHandler } from "@/hooks/useActionHandler";
import ConfirmModal from "@/components/Custom/ConfirmModal";

export default function CouponMain() {
  const { confirmState, setConfirmState, executeAction, handleConfirm } =
    useActionHandler();

  const [isCoupOpen, setCoupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [coupon, setCoupon] = useState({
    code: "",
    description: "",

    applicable: "recharge",

    type: "cashback",

    status: "active",

    visibility: "visible",

    couponCount: 0,

    percentage: 0,
    max_discount: 0,
    redeem_limit: 0,

    start_date: "",
    end_date: "",
  });

  const { can, isSuperAdmin } = usePermissions();
  const canRead = isSuperAdmin || can("coupon", "read");
  const canCreate = isSuperAdmin || can("coupon", "create");
  const canUpdate = isSuperAdmin || can("coupon", "update");

  const { data, loading, refetch } = useQuery(GET_COUPONS, {
    skip: !canRead,
  });

  const [createCoupon] = useMutation(CREATE_COUPON);
  const [deleteCoupon] = useMutation(DELETE_COUPON);
  const [updateStatus] = useMutation(UPDATE_COUPON_STATUS);

  const coupons = data?.getCoupons || [];

  // 🔥 HANDLERS
  const handleChange = (key, value) => {
    setCoupon((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!(isSuperAdmin || can("coupon", "create"))) {
      toast.error("No permission");
      return;
    }

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

            couponCount: Number(coupon.couponCount) || 0,

            percentage: Number(coupon.percentage) || null,

            max_discount: Number(coupon.max_discount) || null,

            redeem_limit: Number(coupon.redeem_limit) || null,

            start_date: coupon.start_date,

            end_date: coupon.end_date,
          },
        },
      });

      toast.success("Coupon Added Successfully");
      setCoupOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!(isSuperAdmin || can("coupon", "delete"))) {
      toast.error("No permission");
      return;
    }

    if (!confirm("Are you sure to delete this coupon?")) return;

    try {
      await deleteCoupon({ variables: { id } });
      toast.success("Coupon Deleted Successfully");
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStatusToggle = async (id, value) => {
    if (!(isSuperAdmin || can("coupon", "update"))) {
      toast.error("No permission");
      return;
    }

    try {
      await updateStatus({
        variables: {
          id,
          status: value ? "active" : "inactive",
        },
      });

      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!canRead) {
    return <p className="p-10 text-red-500">No Access to Coupons</p>;
  }

  if (loading) return <p>Loading coupons...</p>;

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      {isCoupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg flex flex-col gap-3 shadow-lg w-[60%] p-6">
            <div className="flex justify-between bg-[#7a5ba3] text-white px-4 py-3 rounded-full">
              <h3>Add New Coupon</h3>
              <button onClick={() => setCoupOpen(false)}>
                <MdCancel className="text-2xl" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Coupon Code"
                value={coupon.code}
                onChange={(e) => handleChange("code", e.target.value)}
              />

              <CustomInput
                label="Description"
                value={coupon.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />

              {/* APPLICABLE */}
              <CustomDropdown
                label="Applicable On"
                value={coupon.applicable}
                onChange={(e) => handleChange("applicable", e.target.value)}
              >
                <option value="recharge">Recharge</option>
                <option value="services">Services</option>
              </CustomDropdown>

              {/* TYPE */}
              <CustomDropdown
                label="Coupon Type"
                value={coupon.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <option value="cashback">Cashback</option>
                <option value="discount">Discount</option>
              </CustomDropdown>

              <CustomInput
                label="Percentage"
                type="number"
                value={coupon.percentage}
                onChange={(e) => handleChange("percentage", e.target.value)}
              />

              <CustomInput
                label="Max Discount"
                type="number"
                value={coupon.max_discount}
                onChange={(e) => handleChange("max_discount", e.target.value)}
              />

              <CustomInput
                label="Redeem Limit"
                type="number"
                value={coupon.redeem_limit}
                onChange={(e) => handleChange("redeem_limit", e.target.value)}
              />
              <CustomInput
                label="Coupon Count"
                type="number"
                value={coupon.couponCount}
                onChange={(e) => handleChange("couponCount", e.target.value)}
              />

              <CustomInput
                label="Start Date"
                type="date"
                value={coupon.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />

              <CustomInput
                label="End Date"
                type="date"
                value={coupon.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
              />

              {/* STATUS TOGGLE */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <CustomToggle
                  checked={coupon.status === "active"}
                  onChange={(val) =>
                    handleChange("status", val ? "active" : "inactive")
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Visibility
                </label>

                <CustomToggle
                  checked={coupon.visibility === "visible"}
                  onChange={(val) =>
                    handleChange("visibility", val ? "visible" : "hidden")
                  }
                />

                <span className="text-xs text-gray-500">
                  {coupon.visibility}
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <CustomButton
                variant="green"
                onClick={handleSubmit}
                className={
                  !canCreate ? "opacity-50 cursor-not-allowed" : " px-2 py-1"
                }
              >
                Submit
              </CustomButton>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Manage Coupons</h3>

          <CustomButton
            variant="green"
            onClick={() => {
              if (!canCreate) return;
              setCoupOpen(true);
            }}
            className={
              !canCreate ? "opacity-50  cursor-not-allowed" : "px-2 py-1"
            }
          >
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

        {coupons
          .filter((c) =>
            c.code.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((c, index) => (
            <div
              key={c.id}
              className="grid grid-cols-10 border-b p-2 items-center text-sm"
            >
              <div className="text-center">{index + 1}</div>
              <div className="text-center">{c.code}</div>
              <div className="text-center">{c.description}</div>
              <div className="text-center">{c.type}</div>
              <div className="text-center">{c.percentage}</div>
              <div className="text-center">{c.couponCount}</div>

              <div className="text-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    c.visibility === "visible"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.visibility}
                </span>
              </div>
              <div className="text-center">
                {new Date(c.start_date).toLocaleDateString("en-IN")}
              </div>
              <div className="text-center">
                {new Date(c.end_date).toLocaleDateString("en-IN")}
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  disabled={!canUpdate}
                  className={`px-2 py-1 rounded ${
                    !canUpdate
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow-400"
                  }`}
                >
                  <FaEdit />
                </button>

                <ProtectedActionButton
                  module="coupon"
                  action="delete"
                  executeAction={executeAction}
                  mutationFn={deleteCoupon}
                  variables={{ id: c.id }}
                  onSuccess={refetch}
                  className="px-2 py-1 bg-red-400 text-white rounded"
                >
                  <MdDelete />
                </ProtectedActionButton>

                <CustomToggle
                  checked={c.status === true}
                  onChange={(val) => handleStatusToggle(c.id, val)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
