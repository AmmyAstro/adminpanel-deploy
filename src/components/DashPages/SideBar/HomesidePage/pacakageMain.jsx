"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdCancel } from "react-icons/md";
import { TbEdit } from "react-icons/tb";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomToggle from "@/components/Custom/CustomToggle";
import AlertLoading from "@/app/common/AlertLoading";
import ConfirmModal from "@/components/Custom/ConfirmModal";

import {
  GET_RECHARGE_PACKS,
  CREATE_RECHARGE_PACK,
  UPDATE_RECHARGE_PACK,
  DELETE_RECHARGE_PACK,
} from "@/app/graphQL/rechargePack";

import { usePermissions } from "@/context/PermissionContext";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import { useMutation, useQuery } from "@apollo/client/react";
import { useActionHandler } from "@/hooks/useActionHandler";

export default function PackageMain() {
  const [open, setOpen] = useState(false);
  const [editPack, setEditPack] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    talktime: "",
    isActive: true,
  });

  // 🔥 Permissions
  const { can, isSuperAdmin } = usePermissions();
  const canRead = isSuperAdmin || can("walletpackages", "read");
  const canCreate = isSuperAdmin || can("walletpackages", "create");
  const canUpdate = isSuperAdmin || can("walletpackages", "update");

  // 🔥 Action handler (for delete confirm)
  const {
    confirmState,
    setConfirmState,
    executeAction,
    handleConfirm,
  } = useActionHandler();

  // 🔥 Query
  const { data, loading, refetch } = useQuery(GET_RECHARGE_PACKS, {
    skip: !canRead,
  });

  const [createPack] = useMutation(CREATE_RECHARGE_PACK);
  const [updatePack] = useMutation(UPDATE_RECHARGE_PACK);
  const [deletePack] = useMutation(DELETE_RECHARGE_PACK);

  const packs = data?.getRechargePacks || [];

  // 🔥 No access
  if (!canRead) {
    return <p className="p-10 text-red-500">No Access</p>;
  }

  // 🔥 Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      talktime: "",
      isActive: true,
    });
    setEditPack(null);
  };

  const handleSubmit = async () => {
    const canSubmit =
      isSuperAdmin ||
      (editPack
        ? can("walletpackages", "update")
        : can("walletpackages", "create"));

    if (!canSubmit) {
      toast.error("No permission");
      return;
    }

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        talktime: parseInt(form.talktime),
        isActive: form.isActive,
      };

      if (editPack) {
        await updatePack({
          variables: {
            id: editPack.id,
            input: payload,
          },
        });
        toast.success("Package updated");
      } else {
        await createPack({
          variables: { input: payload },
        });
        toast.success("Package created");
      }

      setOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggle = async (pkg) => {
    if (!(isSuperAdmin || can("walletpackages", "update"))) {
      toast.error("No permission");
      return;
    }

    try {
      await updatePack({
        variables: {
          id: pkg.id,
          input: {
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            talktime: pkg.talktime,
            isActive: !pkg.isActive,
          },
        },
      });

      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h3 className="text-xl font-semibold">Manage Wallet Packages</h3>

          <CustomButton
            variant="green"
            onClick={() => {
              if (!canCreate) return;
              resetForm();
              setOpen(true);
            }}
            className={!canCreate ? "opacity-50 cursor-not-allowed" : "px-2 py-1"}
          >
            Create Package
          </CustomButton>
        </div>

        {/* CONFIRM MODAL */}
        <ConfirmModal
          open={!!confirmState}
          onCancel={() => setConfirmState(null)}
          onConfirm={handleConfirm}
        />

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 w-[500px] space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {editPack ? "Edit Package" : "Create Package"}
                </h2>
                <MdCancel
                  className="text-2xl cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Package Name"
                />

                <CustomInput
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                />

                <CustomInput
                  name="talktime"
                  type="number"
                  value={form.talktime}
                  onChange={handleChange}
                  placeholder="Talktime"
                />

                <CustomInput
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm">Active</span>
                <CustomToggle
                  checked={form.isActive}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, isActive: val }))
                  }
                />
              </div>

              <div className="flex justify-end">
                <CustomButton className="px-2 py-1" variant="green" onClick={handleSubmit}>
                  {editPack ? "Update" : "Create"}
                </CustomButton>
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        <AlertLoading show={loading} title="Loading..." />

        {/* TABLE */}
        <div className="mt-10">
          <div className="grid grid-cols-7 bg-purple-300 p-2 font-semibold text-center">
            <div>S.No</div>
            <div>Name</div>
            <div>Price</div>
            <div>Talktime</div>
            <div>Status</div>
            <div>Created</div>
            <div>Action</div>
          </div>

          {packs.map((pkg, index) => (
            <div
              key={pkg.id}
              className="grid grid-cols-7 text-center border-b p-3 items-center"
            >
              <div>{index + 1}</div>
              <div>{pkg.name}</div>
              <div>₹{pkg.price}</div>
              <div>{pkg.talktime}</div>

              <div className="flex justify-center">
                <CustomToggle
                  checked={pkg.isActive}
                  onChange={() => handleToggle(pkg)}
                />
              </div>

              <div>
                {pkg.createdAt
                  ? new Date(pkg.createdAt).toLocaleDateString()
                  : "-"}
              </div>

              <div className="flex gap-2 justify-center">
                {/* EDIT */}
                <button
                  disabled={!canUpdate}
                  onClick={() => {
                    if (!canUpdate) return;
                    setEditPack(pkg);
                    setForm(pkg);
                    setOpen(true);
                  }}
                  className={`p-2 rounded ${
                    !canUpdate
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200"
                  }`}
                >
                  <TbEdit />
                </button>

                {/* DELETE */}
                <ProtectedActionButton
                  module="walletpackages"
                  action="delete"
                  executeAction={executeAction}
                  mutationFn={deletePack}
                  variables={{ id: pkg.id }}
                  onSuccess={() => {
                    toast.success("Deleted");
                    refetch();
                  }}
                  className="p-2 bg-red-500 text-white rounded"
                >
                  <MdDelete />
                </ProtectedActionButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}