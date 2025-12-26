"use client";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";

const dummyData = [
  {
    id: "#0021",
    name: "Atul Digital ",
    phone: "+123 9988568",
    email: "kazifahim93@gmail.com",
    role: "Admin",
    access: "Full Access",
  },
  {
    id: "#0022",
    name: "Ruchika Customer",
    phone: "+123 9988568",
    email: "kazifahim93@gmail.com",
    role: "User",
    access: "Limited Access",

  }
];

export default function PrivilegeMain() {
  const [search, setSearch] = useState({ id: "", name: "", phone: "" });
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const filteredData = dummyData.filter(
    (item) =>
      item.id.toLowerCase().includes(search.id.toLowerCase()) &&
      item.name.toLowerCase().includes(search.name.toLowerCase()) &&
      item.phone.toLowerCase().includes(search.phone.toLowerCase())
  );

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredData.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto my-6 bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Privilege Manager</h3>
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
            <thead className="font-semibold border-b py-5 bg-[#7a5ba3] rounded-lg text-white px-4">
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />{" "}
                  ID
                </th>
                <th className="p-3 text-left">Name</th>             
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Access</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-300 text-[13px] bg-[#7a5ba329] hover:bg-gray-50 transition"
                  >
                    <td className="p-3 flex items-end gap-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                      />{" "}
                      <span> {item.id}</span>
                    </td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.phone}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.role}</td>
                    <td className="p-3">{item.access}</td>
                    <td className="p-3 flex gap-2">
                      <CustomButton className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        <TbEdit className="text-blue-800" />
                      </CustomButton>
                      <CustomButton
                        className="p-2 bg-red-400 text-white rounded-md hover:bg-red-500"
                      >
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
