"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { CREATE_DEPARTMENT, DELETE_DEPARTMENT, GET_DEPARTMENTS, UPDATE_DEPARTMENT } from "@/app/graphQL/privilageOperations"
import DataTable from "@/components/utils/DataTable"


export default function DepartmentManager() {

    const { data, loading, error, refetch } = useQuery(GET_DEPARTMENTS, {
        variables: { page: 1, limit: 10 }
    })

    const departments = data?.getDepartments?.data || []

    const [createDepartment] = useMutation(CREATE_DEPARTMENT)
    const [updateDepartment] = useMutation(UPDATE_DEPARTMENT)
    const [deleteDepartment] = useMutation(DELETE_DEPARTMENT)

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(null)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    const resetForm = () => {
        setName("")
        setDescription("")
        setEditing(null)
    }

    const handleSubmit = async () => {

        if (editing) {

            await updateDepartment({
                variables: {
                    departmentId: editing.id,
                    name,
                    description
                }
            })

        } else {

            await createDepartment({
                variables: { name, description }
            })

        }

        await refetch()

        resetForm()
        setOpen(false)
    }

    const handleDelete = async (id) => {
        await deleteDepartment({ variables: { departmentId: id } })
        refetch()
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error</p>

    const departmentColumns = [
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "Description",
            accessor: "description",
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex justify-center gap-2">

                    <button
                        onClick={() => {
                            setEditing(row)
                            setName(row.name)
                            setDescription(row.description)
                            setOpen(true)
                        }}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => handleDelete(row.id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                    >
                        Delete
                    </button>

                </div>
            ),
        },
    ]

    return (

        <div className="p-10 space-y-5">

            <button
                onClick={() => { resetForm(); setOpen(true) }}
                className="bg-yellow-500 px-4 py-2 rounded"
            >
                Create Department
            </button>

            <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">

                <DataTable
                    columns={departmentColumns}
                    data={departments}
                />

            </div>




            {open && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 w-[400px] space-y-4">

                        <input
                            placeholder="Department Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 w-full"
                        />

                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border p-2 w-full"
                        />

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() => { resetForm(); setOpen(false) }}
                                className="border px-3 py-1"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="bg-black text-white px-3 py-1"
                            >
                                Submit
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    )
}