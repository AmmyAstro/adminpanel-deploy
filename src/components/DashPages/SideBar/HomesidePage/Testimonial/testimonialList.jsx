"use client";



export default function TestimonialList() {


  return (
    <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">


      <div className="flex justify-between items-center p-4">
        <h3 className="heading-banner">Testimonial List</h3>
      
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="grid grid-cols-6 place-items-center font-semibold border-b py-5 bg-[#7a5ba3] rounded-lg text-white px-4">
          <div>S.no</div>
          <div>Banner Name</div>
          <div>Language</div>
          <div>Banner Image</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* {banners?.map((banner, i) => (
          <div
            key={banner.id}
            className="grid grid-cols-6 items-center place-items-center border-b border-purple-300 py-4 px-5 text-sm bg-[#9f83c430] rounded-lg"
          >
            <div>{i + 1}</div>
            <div>{banner.heading}</div>
            <div>{banner.language}</div>

            <div>
              <Image
                src={banner.image}
                alt={banner.heading}
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
                  dispatch(
                    updateBannerRequest({ ...banner, status: !banner.status })
                  )
                }
                className="w-4 h-4 accent-blue-600"
              />
            </div>

            <div className="flex gap-2">
              <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                <TbEdit className="text-blue-800" />
              </button>
              <button
                onClick={() => dispatch(deleteBannerRequest(banner.id))}
                className="p-2 bg-red-400 text-white rounded-md hover:bg-red-500"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}
