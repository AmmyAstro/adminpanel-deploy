"use client";

import { MdDelete, MdCancel } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomToggle from "@/components/Custom/CustomToggle";

import {
  GET_COUPONS,
  CREATE_COUPON,
  DELETE_COUPON,
  UPDATE_COUPON_STATUS,
  UPDATE_COUPON,
} from "../../../../app/graphQL/coupon";

import { usePermissions } from "@/context/PermissionContext";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import { useActionHandler } from "@/hooks/useActionHandler";
import ConfirmModal from "@/components/Custom/ConfirmModal";
import DataTable from "@/components/utils/DataTable";
const INITIAL_COUPON = {
  code: "",
  description: "",
  applicable: "recharge",
  type: "CASHBACK",
  status: "ACTIVE",
  visibility: "VISIBLE",
  couponCount: 0,
  percentage: 0,
  maxDiscount: 0,
  redeemLimit: 0,
  startDate: "",
  endDate: "",
};
export default function CouponMain() {
  const { confirmState, setConfirmState, executeAction, handleConfirm } =
    useActionHandler();
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [isCoupOpen, setCoupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [coupon, setCoupon] = useState(INITIAL_COUPON);

  const { can, isSuperAdmin } = usePermissions();
  const canRead = isSuperAdmin || can("coupon", "read");
  const canCreate = isSuperAdmin || can("coupon", "create");
  const canUpdate = isSuperAdmin || can("coupon", "update");

  const { data, loading, refetch } = useQuery(GET_COUPONS, {
    skip: !canRead,
  });
  const [updateCoupon] = useMutation(UPDATE_COUPON);
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
  const buildPayload = () => ({
    code: coupon.code.trim(),
    description: coupon.description.trim(),
    applicable: coupon.applicable,

    type: coupon.type,
    status: coupon.status,
    visibility: coupon.visibility,

    couponCount: Number(coupon.couponCount) || 0,
    percentage: Number(coupon.percentage) || 0,

    maxDiscount: Number(coupon.maxDiscount) || 0,
    redeemLimit: Number(coupon.redeemLimit) || 0,

    startDate: coupon.startDate,
    endDate: coupon.endDate,
  });

  const handleSubmit = async () => {
    if (!(isSuperAdmin || can("coupon", "create"))) {
      toast.error("No permission");
      return;
    }

    try {
      if (!coupon.code.trim()) {
        return toast.error("Coupon code is required");
      }

      if (!coupon.startDate || !coupon.endDate) {
        return toast.error("Please select start and end dates");
      }

      if (new Date(coupon.startDate) > new Date(coupon.endDate)) {
        return toast.error("End date must be after start date");
      }
      if (editingCouponId) {
        await updateCoupon({
          variables: {
            id: editingCouponId,
            input: buildPayload(),
          },
          refetchQueries: [{ query: GET_COUPONS }],
          awaitRefetchQueries: true,
        });

        toast.success("Coupon Updated Successfully");
      } else {
        await createCoupon({
          variables: {
            input: buildPayload(),
          },
          refetchQueries: [{ query: GET_COUPONS }],
          awaitRefetchQueries: true,
        });

        toast.success("Coupon Added Successfully");
      }
      setCoupon(INITIAL_COUPON);

      setEditingCouponId(null);

      setCoupOpen(false);
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
          status: value ? "ACTIVE" : "INACTIVE",
        },
      });

      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Code",
        accessor: "code",
      },

      // {
      //   header: "Description",
      //   accessor: "description",
      // },

      {
        header: "Type",
        render: (row) => <span className="font-medium">{row.type}</span>,
      },

      {
        header: "Discount %",
        render: (row) => row.percentage ?? 0,
      },

      {
        header: "Count",
        render: (row) => row.couponCount ?? 0,
      },

      {
        header: "Visibility",
        render: (row) => (
          <span
            className={`px-2 py-1 rounded text-xs ${
              row.visibility === "VISIBLE"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row.visibility}
          </span>
        ),
      },
      {
        header: "Start Date",
        render: (row) =>
          row.startDate
            ? new Date(Number(row.startDate)).toLocaleDateString("en-IN")
            : "-",
      },

      {
        header: "End Date",
        render: (row) =>
          row.endDate
            ? new Date(Number(row.endDate)).toLocaleDateString("en-IN")
            : "-",
      },

      {
        header: "Status",
        render: (row) => (
          <CustomToggle
            checked={row.status}
            onChange={(val) => handleStatusToggle(row.id, val)}
          />
        ),
      },

      {
        header: "Actions",
        render: (row) => (
          <div className="flex gap-2 justify-center">
            <button
              disabled={!canUpdate}
              onClick={() => {
                setEditingCouponId(row.id);

                setCoupon({
                  code: row.code || "",
                  description: row.description || "",
                  applicable: row.applicable || "recharge",

                  type: row.type || "CASHBACK",

                  status: row.status ? "ACTIVE" : "INACTIVE",

                  visibility: row.visibility || "VISIBLE",

                  couponCount: row.couponCount || 0,
                  percentage: row.percentage || 0,

                  maxDiscount: row.maxDiscount || 0,
                  redeemLimit: row.redeemLimit || 0,

                  startDate: row.startDate
                    ? new Date(Number(row.startDate))
                        .toISOString()
                        .split("T")[0]
                    : "",

                  endDate: row.endDate
                    ? new Date(Number(row.endDate)).toISOString().split("T")[0]
                    : "",
                });

                setCoupOpen(true);
              }}
            >
              <FaEdit />
            </button>

            <ProtectedActionButton
              module="coupon"
              action="delete"
              executeAction={executeAction}
              mutationFn={deleteCoupon}
              variables={{ id: row.id }}
              onSuccess={refetch}
              className="px-2 py-1 bg-red-400 text-white rounded"
            >
              <MdDelete />
            </ProtectedActionButton>
          </div>
        ),
      },
    ],
    [canUpdate, deleteCoupon, executeAction, refetch],
  );
  const filteredCoupons = coupons.filter((c) =>
    (c.code || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
              <h3>{editingCouponId ? "Edit Coupon" : "Add New Coupon"}</h3>
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
                <option value="CASHBACK">Cashback</option>
                <option value="DISCOUNT">Discount</option>
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
                value={coupon.maxDiscount}
                onChange={(e) => handleChange("maxDiscount", e.target.value)}
              />
              <CustomInput
                label="Redeem Limit"
                type="number"
                value={coupon.redeemLimit}
                onChange={(e) => handleChange("redeemLimit", e.target.value)}
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
                value={coupon.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />

              <CustomInput
                label="End Date"
                type="date"
                value={coupon.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />

              {/* STATUS TOGGLE */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <CustomToggle
                  checked={coupon.status === "ACTIVE"}
                  onChange={(val) =>
                    handleChange("status", val ? "ACTIVE" : "INACTIVE")
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Visibility
                </label>

                <CustomToggle
                  checked={coupon.visibility === "VISIBLE"}
                  onChange={(val) =>
                    handleChange("visibility", val ? "VISIBLE" : "HIDDEN")
                  }
                />
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
                {editingCouponId ? "Update" : "Submit"}
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

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Total Coupons : {coupons.length}
          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
            Active : {coupons.filter((c) => c.status).length}
          </div>

          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
            Hidden : {coupons.filter((c) => c.visibility === "HIDDEN").length}
          </div>
        </div>

        <input
          type="text"
          placeholder="Search coupons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-full p-2 mb-4"
        />

        <div className="overflow-x-auto">
          <div className="bg-white rounded-xl shadow border">
            <DataTable columns={columns} data={filteredCoupons} />
          </div>
        </div>
      </div>
    </div>
  );
}
