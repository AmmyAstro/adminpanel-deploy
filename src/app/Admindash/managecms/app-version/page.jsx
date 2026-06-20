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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await saveVersion({
        variables: {
          data: formData,
        },
      });

      await refetch();

      setFormData({
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

      alert("Version Updated");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-100">
      <div className="max-w-4xl p-6 mx-auto bg-white shadow-xl rounded-3xl">
        <h2 className="mb-6 text-3xl font-bold text-black">
          App Version Management
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <select
            value={formData.platform}
            onChange={(e) =>
              setFormData({
                ...formData,
                platform: e.target.value,
              })
            }
            className="p-3 border rounded-xl"
          >
            <option value="ANDROID">Android</option>

            <option value="IOS">iOS</option>
          </select>

          <input
            type="text"
            placeholder="Latest Version"
            value={formData.latestVersion}
            onChange={(e) =>
              setFormData({
                ...formData,
                latestVersion: e.target.value,
              })
            }
            className="p-3 border rounded-xl"
          />

          <input
            type="text"
            placeholder="Minimum Version"
            value={formData.minimumVersion}
            onChange={(e) =>
              setFormData({
                ...formData,
                minimumVersion: e.target.value,
              })
            }
            className="p-3 border rounded-xl"
          />

          <textarea
            placeholder="Release Notes"
            value={formData.releaseNotes}
            onChange={(e) =>
              setFormData({
                ...formData,
                releaseNotes: e.target.value,
              })
            }
            className="p-3 border rounded-xl"
          />

          <input
            type="text"
            placeholder="Play Store URL"
            value={formData.playStoreUrl}
            onChange={(e) =>
              setFormData({
                ...formData,
                playStoreUrl: e.target.value,
              })
            }
            className="p-3 border rounded-xl"
          />

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
            <input
              type="checkbox"
              checked={formData.maintenanceMode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maintenanceMode: e.target.checked,
                })
              }
            />

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
