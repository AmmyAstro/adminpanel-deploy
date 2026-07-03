"use client";

import { GET_APP_VERSIONS } from "@/app/graphQL/privilageOperations";
import DataTable from "@/components/utils/DataTable";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

const ADD_UPDATE_VERSION = gql`
  mutation AddOrUpdateAppVersion($data: AddAppVersionInput!) {
    addOrUpdateAppVersion(data: $data) {
      success
      message
    }
  }
`;
const DELETE_APP_VERSION = gql`
  mutation DeleteAppVersion($id: ID!) {
    deleteAppVersion(id: $id)
  }
`;

export default function AppVersionPanel() {
  const {
    data,
    loading: versionsLoading,
    refetch,
  } = useQuery(GET_APP_VERSIONS);
  const [deleteVersion] = useMutation(DELETE_APP_VERSION);
  const [errors, setErrors] = useState({});
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this version?",
    );

    if (!confirmed) return;

    try {
      await deleteVersion({
        variables: { id },
      });

      await refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const versions = data?.getAppVersions || [];
  const [formData, setFormData] = useState({
    platform: "ANDROID",
    appType: "USER",
    latestVersion: "",
    minimumVersion: "",

    forceUpdate: false,

    maintenanceMode: false,

    maintenanceMessage: "",

    playStoreUrl: "",
    appStoreUrl: "",

    releaseNotes: "",
  });

  const [saveVersion, { loading }] = useMutation(ADD_UPDATE_VERSION);
  const VERSION_REGEX = /^\d+\.\d+\.\d+$/;

  const compareVersions = (v1, v2) => {
    const a = v1.split(".").map(Number);
    const b = v2.split(".").map(Number);

    for (let i = 0; i < 3; i++) {
      if ((a[i] || 0) > (b[i] || 0)) return 1;
      if ((a[i] || 0) < (b[i] || 0)) return -1;
    }

    return 0;
  };
  const validateForm = () => {
    const err = {};

    // Latest Version
    if (!formData.latestVersion.trim()) {
      err.latestVersion = "Latest version is required";
    } else if (!VERSION_REGEX.test(formData.latestVersion.trim())) {
      err.latestVersion = "Use format like 1.0.0";
    } else if (formData.latestVersion.length > 15) {
      err.latestVersion = "Maximum 15 characters allowed";
    }

    // Minimum Version
    if (!formData.minimumVersion.trim()) {
      err.minimumVersion = "Minimum version is required";
    } else if (!VERSION_REGEX.test(formData.minimumVersion.trim())) {
      err.minimumVersion = "Use format like 1.0.0";
    } else if (formData.minimumVersion.length > 15) {
      err.minimumVersion = "Maximum 15 characters allowed";
    }

    // Release Notes
    if (!formData.releaseNotes.trim()) {
      err.releaseNotes = "Release notes are required";
    } else if (formData.releaseNotes.length > 500) {
      err.releaseNotes = "Release notes cannot exceed 500 characters";
    }

    // Play Store URL
    if (formData.platform === "ANDROID" && !formData.playStoreUrl.trim()) {
      err.playStoreUrl = "Play Store URL is required";
    } else if (
      formData.playStoreUrl &&
      !/^https?:\/\/.+/.test(formData.playStoreUrl)
    ) {
      err.playStoreUrl = "Enter a valid URL";
    }

    // App Store URL
    if (formData.platform === "IOS" && !formData.appStoreUrl.trim()) {
      err.appStoreUrl = "App Store URL is required";
    } else if (
      formData.appStoreUrl &&
      !/^https?:\/\/.+/.test(formData.appStoreUrl)
    ) {
      err.appStoreUrl = "Enter a valid URL";
    }

    // Maintenance Message
    if (formData.maintenanceMode && !formData.maintenanceMessage.trim()) {
      err.maintenanceMessage = "Maintenance message is required";
    }

    if (formData.maintenanceMessage.length > 300) {
      err.maintenanceMessage = "Maximum 300 characters allowed";
    }
    if (
      formData.latestVersion &&
      formData.minimumVersion &&
      VERSION_REGEX.test(formData.latestVersion) &&
      VERSION_REGEX.test(formData.minimumVersion)
    ) {
      if (
        compareVersions(formData.latestVersion, formData.minimumVersion) < 0
      ) {
        err.latestVersion =
          "Latest version must be greater than or equal to minimum version";
      }
    }
    setErrors(err);

    return Object.keys(err).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await saveVersion({
        variables: {
          data: formData,
        },
      });

      await refetch();

      setFormData({
        appType: "USER",
        platform: "ANDROID",
        latestVersion: "",
        minimumVersion: "",
        forceUpdate: false,
        maintenanceMode: false,
        maintenanceMessage: "",
        playStoreUrl: "",
        appStoreUrl: "",
        releaseNotes: "",
      });
setErrors({});
      alert("Version Updated");
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  return (
    <div className="min-h-screen p-5 bg-gray-100">
      <div className="max-w-4xl p-6 mx-auto bg-white shadow-xl rounded-3xl">
        <h2 className="mb-6 text-3xl font-bold text-black">
          App Version Management
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="space-y-1">
  <select
    value={formData.appType}
    onChange={(e) => handleChange("appType", e.target.value)}
    className="p-3 border rounded-xl w-full"
  >
    <option value="USER">User</option>
    <option value="ASTROLOGER">Astrologer</option>
  </select>

  {errors.appType && (
    <p className="text-xs text-red-500">{errors.appType}</p>
  )}
</div>
<div className="space-y-1">
  <select
    value={formData.platform}
    onChange={(e) => handleChange("platform", e.target.value)}
    className="p-3 border rounded-xl w-full"
  >
    <option value="ANDROID">Android</option>
    <option value="IOS">iOS</option>
  </select>

  {errors.platform && (
    <p className="text-xs text-red-500">{errors.platform}</p>
  )}
</div>

        <div className="space-y-1">
  <input
    type="text"
    placeholder="Latest Version (1.0.0)"
    value={formData.latestVersion}
    maxLength={15}
    onChange={(e) =>
      handleChange(
        "latestVersion",
        e.target.value.replace(/\s/g, "")
      )
    }
    className="p-3 border rounded-xl w-full"
  />

  {errors.latestVersion && (
    <p className="text-xs text-red-500">
      {errors.latestVersion}
    </p>
  )}
</div>

    <div className="space-y-1">
  <input
    type="text"
    placeholder="Minimum Version (1.0.0)"
    value={formData.minimumVersion}
    maxLength={15}
    onChange={(e) =>
      handleChange(
        "minimumVersion",
        e.target.value.replace(/\s/g, "")
      )
    }
    className="p-3 border rounded-xl w-full"
  />

  {errors.minimumVersion && (
    <p className="text-xs text-red-500">
      {errors.minimumVersion}
    </p>
  )}
</div>

     <div className="space-y-1">
  <textarea
    placeholder="Release Notes"
    maxLength={500}
    value={formData.releaseNotes}
    onChange={(e) =>
      handleChange("releaseNotes", e.target.value)
    }
    className="p-3 border rounded-xl w-full"
  />

  {errors.releaseNotes && (
    <p className="text-xs text-red-500">
      {errors.releaseNotes}
    </p>
  )}
</div>

    <div className="space-y-1">
  <input
    type="url"
    placeholder="Play Store URL"
    maxLength={300}
    value={formData.playStoreUrl}
    onChange={(e) =>
      handleChange("playStoreUrl", e.target.value)
    }
    className="p-3 border rounded-xl w-full"
  />

  {errors.playStoreUrl && (
    <p className="text-xs text-red-500">
      {errors.playStoreUrl}
    </p>
  )}
</div>
{formData.platform === "IOS" && (
  <div className="space-y-1">
    <input
      type="url"
      placeholder="App Store URL"
      maxLength={300}
      value={formData.appStoreUrl}
      onChange={(e) =>
        handleChange("appStoreUrl", e.target.value)
      }
      className="p-3 border rounded-xl w-full"
    />

    {errors.appStoreUrl && (
      <p className="text-xs text-red-500">
        {errors.appStoreUrl}
      </p>
    )}
  </div>
)}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.forceUpdate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  forceUpdate: e.target.checked,
                })
              }
            />

            <p className="text-black">Force Update</p>
          </div>

          <div className="flex items-center gap-3">
          <div className="space-y-1">
  <textarea
    placeholder="Maintenance Message"
    maxLength={300}
    value={formData.maintenanceMessage}
    onChange={(e) =>
      handleChange(
        "maintenanceMessage",
        e.target.value
      )
    }
    className="p-3 border rounded-xl w-full"
  />

  {errors.maintenanceMessage && (
    <p className="text-xs text-red-500">
      {errors.maintenanceMessage}
    </p>
  )}
</div>

            <p className="text-black">Maintenance Mode</p>
          </div>

          <textarea
            placeholder="Maintenance Message"
            value={formData.maintenanceMessage}
            onChange={(e) =>
              setFormData({
                ...formData,
                maintenanceMessage: e.target.value,
              })
            }
            className="p-3 border rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="p-3 font-semibold text-white bg-purple-900 rounded-xl"
          >
            {loading ? "Saving..." : "Save Version"}
          </button>
        </form>

        {versionsLoading ? (
          <p>Loading versions...</p>
        ) : (
          <DataTable
            columns={[
              {
                header: "App Type",
                accessor: "appType",
              },
              {
                header: "Platform",
                accessor: "platform",
              },
              {
                header: "Latest",
                accessor: "latestVersion",
              },
              {
                header: "Minimum",
                accessor: "minimumVersion",
              },
              {
                header: "Release Notes",
                render: (row) => row.releaseNotes?.slice(0, 50) || "-",
              },
              {
                header: "Force Update",
                render: (row) => (row.forceUpdate ? "Yes" : "No"),
              },
              {
                header: "Maintenance",
                render: (row) => (row.maintenanceMode ? "Yes" : "No"),
              },
              {
                header: "Actions",
                render: (row) => (
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                ),
              },
            ]}
            data={versions}
          />
        )}
      </div>
    </div>
  );
}
