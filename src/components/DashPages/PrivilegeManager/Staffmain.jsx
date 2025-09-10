"use client";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import { useState } from "react";

export default function Staffmain() {
  const [roles, setRoles] = useState([
    "Analyst",
    "Developer",
    "SEO",
    "Designer",
    "Writer",
    "Creator",
  ]);
  const [selectedRole, setSelectedRole] = useState("");
  const [newRole, setNewRole] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [privileges, setPrivileges] = useState({
    create: false,
    edit: false,
    delete: false,
    siteInfo: false,
    memberInfo: false,
  });

  const [selectAll, setSelectAll] = useState(false);

  const handleCheckAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setPrivileges({
      create: newValue,
      edit: newValue,
      delete: newValue,
      siteInfo: newValue,
      memberInfo: newValue,
    });
  };

  const handlePrivilegeChange = (key) => {
    setPrivileges({ ...privileges, [key]: !privileges[key] });
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (newRole.trim() !== "") {
      setRoles([...roles, newRole]);
      setNewRole("");
      setShowForm(false);
    }
  };

  return (
    <div className=" mx-auto my-6 bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-6">Roles Privilege Manager</h3>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <img src="/admin-img/12.png" alt="user" className="w-8 h-8" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-yellow-300"
          >
            <option disabled value="">
              Enter Role
            </option>
            {roles.map((role, idx) => (
              <option key={idx} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <CustomButton variant={"green"}
            onClick={() => setShowForm(true)}
            className="px-3 py-1 transition">
            Create New Role
          </CustomButton>
          <CustomButton variant={"yellow"} className=" px-3 py-1 transition text-white">
            Update Privilege
          </CustomButton>
        </div>
      </div>

      {showForm && (
        <div className="bg-gray-100 border border-gray-200 p-6 rounded-lg mb-6">
          <h2 className="text-base w-40 font-semibold mb-4 text-center bg-purple-900 text-white py-2 rounded-full">
            Add New Role
          </h2>
          <form onSubmit={handleAddRole} className="flex flex-col gap-4 w-50">
            <CustomInput
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Enter role..."
              className="px-3 py-2"
              required
            />
            <div className="flex gap-3 justify-center">
              <CustomButton
                type="submit"
                className="px-4 py-2 "
              >
                Save
              </CustomButton>
              <CustomButton         
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 "
              >
                Close
              </CustomButton>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleCheckAll}
          className="w-4 h-4"
        />
        <h3 className="text-lg font-medium">Check All</h3>
      </div>
      <hr className="mb-6" />

      <div className="space-y-6">
        <div>
          <h6 className="font-semibold mb-2">Website Setup</h6>

          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={privileges.create}
                onChange={() => handlePrivilegeChange("create")}
              />
              <span>Create</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={privileges.edit}
                onChange={() => handlePrivilegeChange("edit")}
              />
              <span>Edit</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={privileges.delete}
                onChange={() => handlePrivilegeChange("delete")}
              />
              <span>Delete</span>
            </label>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={
                  privileges.siteInfo && privileges.memberInfo ? true : false
                }
                onChange={() => {
                  const newVal = !(
                    privileges.siteInfo && privileges.memberInfo
                  );
                  setPrivileges({
                    ...privileges,
                    siteInfo: newVal,
                    memberInfo: newVal,
                  });
                }}
              />
              Select All
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={privileges.siteInfo}
                onChange={() => handlePrivilegeChange("siteInfo")}
              />
              Site Info
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={privileges.memberInfo}
                onChange={() => handlePrivilegeChange("memberInfo")}
              />
              Member Info
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
