"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdCancel } from "react-icons/md";
import { TbEdit } from "react-icons/tb";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomToggle from "@/components/Custom/CustomToggle";
import AlertLoading from "@/app/common/AlertLoading";

import {
  GET_RECHARGE_PACKS,
  CREATE_RECHARGE_PACK,
  UPDATE_RECHARGE_PACK,
  DELETE_RECHARGE_PACK,
} from "../../../../app/graphQL/rechargePack";
import { useMutation, useQuery } from "@apollo/client/react";

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

  const { data, loading, refetch } = useQuery(GET_RECHARGE_PACKS);

  const [createPack] = useMutation(CREATE_RECHARGE_PACK);
  const [updatePack] = useMutation(UPDATE_RECHARGE_PACK);
  const [deletePack] = useMutation(DELETE_RECHARGE_PACK);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
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
      setEditPack(null);
      setForm({
        name: "",
        description: "",
        price: "",
        talktime: "",
        isActive: true,
      });

      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePack({ variables: { id } });
      toast.success("Package deleted");
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggle = async (pkg) => {
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

  const getRechargePacks = data?.getRechargePacks || [];

  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between mb-6">
          <h3 className="text-xl font-semibold">Manage Wallet Packages</h3>

          <CustomButton variant="green" onClick={() => setOpen(true)}>
            Add Package
          </CustomButton>
        </div>

        {/* Modal */}

        {open && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 w-[500px]">
              <div className="flex justify-end">
                <MdCancel
                  className="text-2xl cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
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

              <div className="flex justify-center mt-5">
                <CustomButton variant="green" onClick={handleSubmit}>
                  Submit
                </CustomButton>
              </div>
            </div>
          </div>
        )}

        <AlertLoading show={loading} title="Loading..." />

        {/* Table */}

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

          {getRechargePacks.map((pkg, index) => (
            <div
              key={pkg.id}
              className="grid grid-cols-7 text-center border-b p-3"
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

              <div>{new Date(pkg.createdAt).toLocaleDateString()}</div>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setEditPack(pkg);
                    setForm(pkg);
                    setOpen(true);
                  }}
                  className="p-2 bg-gray-200 rounded"
                >
                  <TbEdit />
                </button>

                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 bg-red-500 text-white rounded"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}