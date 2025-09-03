"use client";
import { useState } from "react";
import Image from "next/image";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
export default function BannerManager() {
  const [isOpen, setIsOpen] = useState(false);

 
  const [banners, setBanners] = useState([
    {
      id: 1,
      name: "Main Banner",
      language: "English",
     
      image: "/admin-img/b1.jpg",
      status: true,
    },
    {
      id: 2,
      name: "Destiny Banner",
      language: "English",
     
      image: "/admin-img/b2.jpg",
      status: false,
    },
    {
      id: 3,
      name: "Dhwani Banner",
      language: "Hindi",
  
      image: "/admin-img/b3.jpg",
      status: true,
    },
  ]);

  return (
    <div className=" bg-gray-100 rounded-lg mt-10">

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] p-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h6 className="text-lg font-semibold">Add Banner Image</h6>
              <button onClick={() => setIsOpen(false)}>
                <Image
                  src="/img/square-x.png"
                  alt="close"
                  width={20}
                  height={20}
                />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Language
                </label>
                <select className="w-full border rounded-md p-2">
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Heading</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Enter main banner heading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub Heading
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Enter sub heading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Enter banner link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md p-2"
                  placeholder="Enter sort order"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Enter slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input type="file" className="w-full border rounded-md p-2" />
                <small className="text-red-500">
                  *NOTE: Maximum upload limit 1MB
                </small>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Section */}
      <div className="flex justify-between items-center p-4">
        <h3 className="heading-banner">Manage Banners</h3>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-full" >
          Add New Banner
        </button>
      </div>

      {/* Banner List */}
      <div className="p-4 flex flex-col gap-3">
        <div className="grid grid-cols-6 place-items-center font-semibold border-b py-5 bg-[#7a5ba3] rounded-lg text-white px-4 ">
          <div>S.no</div>
          <div>Banner Name</div>
          <div>Language</div>
   
          <div>Banner Image</div>
          <div>Status</div>
          <div>Edit</div>
        </div>

        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className="grid grid-cols-6 items-center place-items-center  border-b border-purple-300 py-4 px-5 text-sm bg-[#9f83c430] rounded-lg "
          >
            <div>{i + 1}</div>
            <div>{banner.name}</div>
            <div>{banner.language}</div>
        
            <div>
              <Image
                src={banner.image}
                alt={banner.name}
                width={200}
                height={80}
                className="rounded-lg"
              />
            </div>
            <div>
              <input
                type="checkbox"
                checked={banner.status}
                onChange={() =>
                  setBanners((prev) =>
                    prev.map((b) =>
                      b.id === banner.id ? { ...b, status: !b.status } : b
                    )
                  )
                }
                className="w-4 h-4 accent-blue-600"
              />
                 {/* <input class="form-check-input" type="checkbox" role="switch" /> */}
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
               <TbEdit className="text-blue-800" />
              </button>
              <button
                onClick={() =>
                  setBanners((prev) => prev.filter((b) => b.id !== banner.id))
                }
                className="p-2 bg-red-400 text-white rounded-md hover:bg-red-500"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
