// "use client";

// import CustomButton from "@/components/Custom/CustomButtom";
// import CustomInput from "@/components/Custom/CustomInput";

// export default function AddTestimonial() {
//   return (
//     <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
//       <div className="m-4 bg-white shadow-md rounded-lg p-6">
   
//         <h2 className="text-xl font-bold text-[#2c0a4d] mb-6">
//           Add New Testimonials
//         </h2>

     
//         <div className="flex flex-col md:flex-row gap-6 mb-6">
//           <div className="flex flex-col w-full">
//             <label className="text-sm font-medium mb-1">Name</label>
//             <div className="flex items-center gap-2 border border-gray-400 rounded-xl px-2 p-1">
//               <img src="/admin-img/userte.png" alt="user" className="input-img-side" />           
//               <CustomInput
//                 type="text"
//                 placeholder="Enter your name here"
//                 className="w-full outline-none border-0 border-none bg-transparent"
//               />
//             </div>
//           </div>
//           <div className="flex flex-col w-full">
//             <label className="text-sm font-medium mb-1">Location</label>
//             <div className="flex items-center gap-2 border border-gray-400 rounded-xl  p-1">
//               <img src="/admin-img/location.png" alt="location" className="input-img-side" />
//               <CustomInput
//                 type="text"
//                 placeholder="Enter your location here"
//                 className="w-full outline-none border-0 border-none bg-transparent"
//               />
//             </div>
//           </div>
//         </div>

      
//         <div className="mb-6">
//           <label className="text-sm font-medium mb-1">
//             Testimonial Description
//           </label>
//           <div className="flex items-start gap-2 border border-gray-400 rounded-xl p-1">
//             <img src="/admin-img/id-badge.png" alt="desc" className="input-img-side " />
//             <textarea
//               className="w-full outline-none bg-transparent resize-none"
//               rows="3"
//               placeholder="Enter Description"
//             ></textarea>
//           </div>
//         </div>

      
//         <div className="flex flex-col md:flex-row gap-6 mb-6">
//           <div className="flex flex-col w-full">
//             <label className="text-sm font-medium mb-1">File Type</label>
//             <div className="flex items-center gap-2 border border-gray-400 rounded-xl p-1">
//               <img src="/admin-img/status.png" alt="file" className="input-img-side" />
//               <select className="w-full bg-transparent outline-none">
//                 <option hidden>Select File</option>
//                 <option value="profile">Profile Image</option>
//                 <option value="video">Video Link</option>
//               </select>
//             </div>
//           </div>
//           <div className="flex flex-col w-full">
//             <label className="text-sm font-medium mb-1">Choose File</label>
//             <div className="flex items-center gap-2 border border-gray-400 rounded-xl p-1">
//               <img src="/admin-img/image.png" alt="upload" className="input-img-side" />
//               <CustomInput
//                 type="file"
//                 className="w-full outline-none border-0 border-none bg-transparent"
//               />
//             </div>
//           </div>
//         </div>

   
//         <div className="mb-6">
//           <label className="text-sm font-medium mb-1">
//             Youtube Link 
//           </label>
//           <div className="flex items-center gap-2 border border-gray-400 rounded-xl p-1">
//             <img
//               src="/admin-img/user-experience.png"
//               alt="youtube"
//               className="input-img-side"/>
//             <CustomInput
//               type="text"
//               placeholder="Enter  youtube link here"
//               className="w-full outline-none border-0 border-none bg-transparent"
//             />
//           </div>
//         </div>


//         <div className="flex flex-col md:flex-row gap-6 mb-6">
//           <div className="flex flex-col w-full">
//             <label className="text-sm font-medium mb-1">Rating</label>
//             <div className="flex items-center gap-2 border border-gray-400 rounded-xl p-1">
//               <img src="/admin-img/membership.png" alt="rating" className="input-img-side" />
//               <select className="w-full bg-transparent outline-none">
//                 <option hidden>Select Rating</option>
//                 <option value="1">1</option>
//                 <option value="2">2</option>
//                 <option value="3">3</option>
//                 <option value="4">4</option>
//                 <option value="5">5</option>
//               </select>
//             </div>
//           </div>
//           <div className="flex flex-col w-full">
//             <label className="text-sm font-medium mb-1">Select Status</label>
//             <div className="flex items-center gap-2 border border-gray-400 rounded-xl p-1">
//               <img src="/admin-img/status.png" alt="status" className="input-img-side" />
//               <select className="w-full bg-transparent outline-none">
//                 <option hidden>Select Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>
//         </div>

      
//         <div className="flex gap-4 items-center justify-center mt-4">
//           <CustomButton variant={"green"} className="bg-[#2c0a4d] text-white px-6 py-2   transition">
//             SUBMIT
//           </CustomButton>
//           <CustomButton variant={"gray"} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition">
//             Reset
//           </CustomButton>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useDispatch, useSelector } from "react-redux";
import { fetchFirstRequest } from "@/redux/slices/firstSlice";

export default function AddTestimonial() {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.first);

  return (
    <div className="p-4">
      <button
        onClick={() => dispatch(fetchFirstRequest())}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Fetch First Data
      </button>

      {loading && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
