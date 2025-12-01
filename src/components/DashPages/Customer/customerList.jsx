"use client";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit, FaUserCircle } from "react-icons/fa";
const dummyData = [
    {
        id: "1",
        name: "Atul Digital ",
        gender: "Male",

        address: "TA-107 Newyork",
        phone: "+123 9988568",
        email: "kazifahim93@gmail.com",
    },
    {
        id: "2",
        name: "Ruchika Customer",
        gender: "Female",

        address: "59 Australia, Sydney",
        phone: "+123 9988568",
        email: "kazifahim93@gmail.com",
    },
];

export default function CustomerList() {
    const [search, setSearch] = useState({ id: "", name: "", phone: "" });

    const filteredData = dummyData.filter(
        (item) =>
            item.id.toLowerCase().includes(search.id.toLowerCase()) &&
            item.name.toLowerCase().includes(search.name.toLowerCase()) &&
            item.phone.toLowerCase().includes(search.phone.toLowerCase())
    );




    return (
        <div className="min-h-screen ">
            <div className="mx-auto my-6 bg-white shadow-lg rounded-xl p-6">
                <div className="flex justify-center items-center mb-3">
                    <h3 className="text-2xl text-center font-bold text-gray-800">Customer List</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <CustomInput
                        type="text"
                        placeholder="Search by ID..."
                        value={search.id}
                        onChange={(e) => setSearch({ ...search, id: e.target.value })}
                        className="px-3 py-2  "
                    />
                    <CustomInput
                        type="text"
                        placeholder="Search by Name..."
                        value={search.name}
                        onChange={(e) => setSearch({ ...search, name: e.target.value })}
                        className="px-3 py-2  "
                    />
                    <CustomInput
                        type="text"
                        placeholder="Search by Phone..."
                        value={search.phone}
                        onChange={(e) => setSearch({ ...search, phone: e.target.value })}
                        className="px-3 py-2  "
                    />
                    <CustomButton variant={"yellow"}
                        onClick={() => console.log("Searched Data:", filteredData)}
                        className=" font-semibold py-2  transition"
                    >
                        SEARCH
                    </CustomButton>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="font-bold border-b py-5 bg-purple-200 p-2 text-sm text-purple-900 rounded-lg px-4">
                            <tr>
                                <th className="p-3 text-left">S.no</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Gender</th>

                                <th className="p-3 text-left">Address</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-300 text-[13px] bg-[#7d738929] hover:bg-gray-50 transition"
                                     >
                                        <td className="p-3 flex items-end gap-2">

                                            <span> {item.id}</span>
                                        </td>
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">{item.gender}</td>

                                        <td className="p-3">{item.address}</td>
                                        <td className="p-3">{item.phone}</td>
                                        <td className="p-3">{item.email}</td>
                                        <td className="p-3 flex gap-2">
                                             <CustomButton 
                                                className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 hover:scale-102">
                                                <FaUserCircle />
                                            </CustomButton>
                                            <CustomButton variant={"yellow"} className="p-2 bg-gray-300 text-white rounded-full hover:bg-gray-400 hover:scale-102">
                                   <FaEdit />
                                            </CustomButton>
                                            <CustomButton 
                                                className="p-2 bg-red-400 text-white rounded-full hover:bg-red-500 hover:scale-102">
                                                <MdDelete />
                                            </CustomButton>
                                                   
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="p-3 text-center text-gray-500" colSpan="10">
                                        No results found 🚫
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
