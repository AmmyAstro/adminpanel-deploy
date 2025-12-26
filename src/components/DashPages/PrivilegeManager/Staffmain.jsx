"use client";

import { useState } from "react";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";

export default function Staffmain() {
  const [activeTab, setActiveTab] = useState("role");

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState("");

  const [permissions, setPermissions] = useState({
    astrologer: {
      ViewProfile: false,
      EditProfile: false,
      ManageAvailability: false,
    },
    chat: {
      ViewChat: false,
      ReplyChat: false,
      DeleteChat: false,
    },
  });

  const togglePermission = (section, key) => {
    setPermissions((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;

    setRoles([...roles, newRole]);
    setNewRole("");
    setShowForm(false);
  };
  const confirmDeleteRole = () => {
    if (!roleToDelete) return;

    setRoles((prev) => prev.filter((role) => role !== roleToDelete));

    if (selectedRole === roleToDelete) {
      setSelectedRole("");
    }

    setRoleToDelete("");
    setShowDeleteModal(false);
  };
  const [profileRole, setProfileRole] = useState("");
  const [profilePermissions, setProfilePermissions] = useState({
    astrologer: {
      viewProfile: false,
      editProfile: false,
    },
    chat: {
      viewChat: false,
      replyChat: false,
    },
  });

  const toggleProfilePermission = (section, key) => {
    setProfilePermissions((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  return (
    <div className="mx-auto my-6 bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-6">Staff Management Console</h3>

      <div className="flex border-b pb-5 gap-15 w-full items-center justify-center mb-6">
        <button
          onClick={() => setActiveTab("role")}
          className={`px-8 rounded-xl cursor-pointer py-2 font-semibold transition ${activeTab === "role" ? "bg-purple-400  text-white" : "text-gray-400"
            }`}
        >
          Role Manager
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`px-8 py-2 rounded-xl cursor-pointer font-semibold transition ${activeTab === "profile"
            ? "bg-purple-400  text-white"
            : "text-gray-400"
            }`}
        >
          Profile Manager
        </button>
      </div>

      <div className="shadow p-5 rounded-2xl">
        {activeTab === "role" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold mb-2">Select Role</h4>

              <div className="border border-gray-200 shadow-xl rounded-xl p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {roles.map((role) => {
                    const isActive = selectedRole === role;

                    return (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`px-8 py-3 cursor-pointer bg-purple-100 rounded-lg text-lg font-medium transition
                         ${isActive ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-700 hover:bg-purple-200"} `} >
                        {role}
                      </button>
                    );
                  })}

                  {!showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-4 py-2 cursor-pointer rounded-full text-sm font-medium border border-dashed text-green-500 hover:bg-green-50" >
                      + Add New Role
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 cursor-pointer rounded-full text-sm font-medium border-dashed border text-red-600 hover:bg-red-50" >
                    - Delete Role
                  </button>
                </div>

                {/* Add Role Form */}
                {showForm && (
                  <form onSubmit={handleAddRole} className="flex gap-3">
                    <CustomInput
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="Enter new role"
                    />
                    <CustomButton type="submit">Add</CustomButton>

                    <CustomButton
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setNewRole("");
                      }}
                      variant="secondary"
                    >
                      Cancel
                    </CustomButton>
                  </form>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-2">
                Role Permission Manager
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Astrologer Permissions */}
                <div className="border border-gray-300 shadow-xl rounded-2xl p-4">
                  <h5 className="font-semibold mb-4">Astrologer Permissions</h5>

                  <div className="flex flex-wrap gap-3">
                    {Object.keys(permissions.astrologer).map((key) => {
                      const isActive = permissions.astrologer[key];

                      return (
                        <button
                          key={key}
                          onClick={() => togglePermission("astrologer", key)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer
                            ${isActive ? "bg-black text-white" : "bg-gray-100 text-gray-600"} `} >
                          {key.replace(/([A-Z])/g, " $1")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Chat Permissions */}
                <div className="border border-gray-300 shadow-xl rounded-2xl p-4">
                  <h5 className="font-semibold mb-4">Chat Permissions</h5>

                  <div className="flex flex-wrap gap-3">
                    {Object.keys(permissions.chat).map((key) => {
                      const isActive = permissions.chat[key];

                      return (
                        <button
                          key={key}
                          onClick={() => togglePermission("chat", key)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer
                            ${isActive
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-600"
                            } `}
                        >
                          {key.replace(/([A-Z])/g, " $1")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <CustomButton variant="green" className="px-4 py-1">
                Save
              </CustomButton>

              <CustomButton variant="gray"  className="px-4 py-1 ">
                Cancel
              </CustomButton> 
            </div>


          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
              <h4 className="text-lg font-bold mb-4">Delete Role</h4>

              <p className="text-sm text-gray-600 mb-4">
                Select a role to permanently delete.
              </p>

              <select
                className="w-full border rounded-md p-2 mb-6"
                value={roleToDelete}
                onChange={(e) => setRoleToDelete(e.target.value)}
              >
                <option value="">-- Select Role --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setRoleToDelete("");
                  }}
                  className="px-4 py-2 rounded-md border text-gray-600"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteRole}
                  disabled={!roleToDelete}
                  className="px-4 py-2 rounded-md bg-red-600 text-white disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}




        {/* -------------------------profile tab--------------- */}

        {activeTab === "profile" && (
          <div className="space-y-8">
            <h4 className="text-xl font-bold">Create Staff Profile</h4>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput placeholder="Full Name" />
              <CustomInput placeholder="Email Address" />
              <CustomInput placeholder="Mobile Number" />
              <CustomInput placeholder="Password" type="password" />
              <div>
                <h5 className="font-semibold mb-3">Assign Role</h5>

                <div className="border border-gray-200 rounded-xl shadow-xl p-6 flex flex-wrap gap-3">
                  {roles.map((role) => {
                    const isActive = profileRole === role;

                    return (
                      <button
                        key={role}
                        onClick={() => setProfileRole(role)}
                        className={`px-4 cursor-pointer py-2 rounded-md text-sm font-medium transition
                          ${isActive ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} `} >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h5 className="font-semibold mb-4">Assign Permissions</h5>

                <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200 p-6 rounded-xl shadow-xl gap-6">
                  <div className="border border-gray-100 rounded-xl shadow p-3">
                    <h6 className="font-semibold mb-3">
                      Astrologer Permissions
                    </h6>

                    <div className="flex flex-wrap gap-3">
                      {Object.keys(profilePermissions.astrologer).map((key) => {
                        const active = profilePermissions.astrologer[key];

                        return (
                          <button
                            key={key}
                            onClick={() =>
                              toggleProfilePermission("astrologer", key)
                            }
                            className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition
                                ${active ? "bg-black text-white" : "bg-gray-100 text-gray-600"} `} >
                            {key.replace(/([A-Z])/g, " $1")}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-xl shadow p-3">
                    <h6 className="font-semibold mb-3">Chat Permissions</h6>

                    <div className="flex flex-wrap gap-3">
                      {Object.keys(profilePermissions.chat).map((key) => {
                        const active = profilePermissions.chat[key];

                        return (
                          <button
                            key={key}
                            onClick={() => toggleProfilePermission("chat", key)}
                            className={`px-4 cursor-pointer py-2 rounded-full text-sm font-medium transition
                                 ${active ? "bg-black text-white" : "bg-gray-100 text-gray-600"} `} >
                            {key.replace(/([A-Z])/g, " $1")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <CustomButton variant="green" className="px-4 py-1">
                Create Profile
              </CustomButton>

              <CustomButton
                variant="gray"
                className="px-4 py-1"
                onClick={() => {
                  setProfileRole("");
                  setProfilePermissions({
                    astrologer: {
                      viewProfile: false,
                      editProfile: false,
                    },
                    chat: {
                      viewChat: false,
                      replyChat: false,
                    },
                  });
                }}
              >
                Cancel
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
