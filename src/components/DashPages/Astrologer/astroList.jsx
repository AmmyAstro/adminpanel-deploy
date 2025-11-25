"use client";

import { mainurl } from "@/app/redux/config";
import { getRequestList } from "@/app/redux/slices/astrologer/GetListSlice";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomToggle from "@/components/Custom/CustomToggle";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaUserSecret } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { TbPasswordFingerprint } from "react-icons/tb";
import toast from "react-hot-toast";
import { getAccountList,resetCode } from "@/app/redux/slices/astrologer/ActiveAccountSlice";
import AlertLoading from "@/app/common/AlertLoading";
import { ImProfile } from "react-icons/im";
import { useRouter } from "next/navigation";










export default function AstroList() {


    const dispatch = useDispatch();
    const router= useRouter();
   const { loading, astrolist } = useSelector((state) => state.astrologerlist);
            const { accountloading, activeaccount,statusCode } = useSelector((state) => state.astrologeractive);
    const astrologerlist = useMemo(() => {
        return astrolist?.sortedAstrologers;
    }, [astrolist])
    useEffect(() => {

        dispatch(getRequestList());

    }, [dispatch])


    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [astrodetail,setAstroDetail]= useState("");
    const [password, setPassword] = useState("");

    const HandlerPassword = (astro_id,name,phone) => {
      setShowUpdatePopup(true);
      setAstroDetail({
        astroId:astro_id,
        profilename:name,
        phonenumber:phone
      })}






   const astrologerProfile = (id) => {
  router.push(`astrolist/astroprofile/${id}`);
}


      const generateAccount= () =>{
       try {
         
         if(password === ""){
           toast.error("Please Enter New Password!");
         }else{
    let payload= {
            newPassword:password,
            phone:astrodetail?.phonenumber
         }


    
          dispatch(getAccountList(payload))



        }

        
       } catch (error) {
        
       }
      }





      useEffect(()=>{
        if(statusCode === 200){
            dispatch(resetCode());
        toast.success("Congragucation Astrologer Account Active!");

   setShowUpdatePopup(false)
        }
      },[statusCode])

    return (
        <div className="min-h-screen ">
            <div className="shadow-md rounded-xl p-3 bg-purple-200 mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-purple-900">
                    Astrologer List
                </h2>
                <div className="flex items-center justify-between gap-3 text-xs">
                    <CustomButton variant={"main"} className="px-3 py-1 rounded-xl font-semibold">Copy</CustomButton>
                    <CustomButton variant={"main"} className="px-3 py-1 rounded-xl font-semibold">Excel</CustomButton>
                    <CustomButton variant={"main"} className="px-3 py-1 rounded-xl font-semibold">PDF</CustomButton>
                    <CustomInput className="px-3 py-1" placeholder="search here..." />
                </div>
            </div>
            <ul className="grid w-full grid-cols-8 place-self-center items-center justify-center place-center self-center font-bold bg-purple-200 rounded-md p-2 text-sm text-purple-900">
                <li>S.No</li>
                <li>Name</li>
                <li>Mobile</li>
             
                <li>Secret Login</li>
                <li>Activity</li>
                <li>Status</li>
                   <li>Last Login</li>

                <li>Action</li>
            </ul>

            {astrologerlist?.map((row, index) => (
                <ul
                    key={row.id}
                    className="grid grid-cols-8 border-b border-gray-200 text-sm text-gray-700 p-2 hover:bg-gray-50">
                    <li>{index + 1}</li>

                    <li>     <div className="flex items-center gap-2">
                        <Image src={mainurl + 'ds-img/' + row.profile_image}
                            alt="altro image"
                            width={60} height={60}
                            className="rounded-full w-12 h-12" />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm">{row?.full_name}</span>
                            <small>ID: <i>00#-{row?.id}</i></small>
                        </div>
                    </div></li>
                    <li className="line-clamp-2  text-ellipsis ">{row?.mobile2}</li>
                   
                    <li>
                        <CustomButton variant={"black"} className="px-2 py-2 text-white rounded-lg font-semibold">
                            <FaUserSecret />
                        </CustomButton>
                    </li>


                    <li>
                        <div className="flex flex-col gap-1">

                            {
                                row?.availability === 1 &&
                                <span className="px-2 py-1 text-xs bg-green-400 w-fit text-white rounded-full">Online</span>
                            }

                            {
                                row?.availability === 0 &&
                                <span className="px-2 py-1 text-xs bg-red-400 w-fit text-white rounded-full">Offline</span>
                            }

                            {
                                row?.availability === 2 &&
                                <span className="px-2 py-1 text-xs bg-yellow-400 w-fit text-white rounded-full">Busy</span>
                            }



                        </div>
                    </li>
                    <li>
                        {
                            row?.availability === 1 && 
                              <CustomToggle
                        checked
                            id="chat"
                        // onChange={(val)}
                        />
                        }
                         {
                            row?.availability === 0 && 
                              <CustomToggle
                    
                            id="chat"
                        // onChange={(val)}
                        />
                        }

                         {
                            row?.availability === 2 && 
                              <CustomToggle
                    
                            id="chat"
                        // onChange={(val)}
                        />
                        }
                      
                        
                        </li>

                        
                    <li>
                        <div className="flex items-center justify-center gap-3 text-xs">

                         23/11/25 10:20 am
                         
                        </div></li>


                    <li>
                        <div className="flex items-center justify-center gap-3 text-xs">

                            <CustomButton variant={"red"} className="px-2 py-2 text-white rounded-lg font-semibold"
                                onClick={()=>HandlerPassword(row?.id,row?.full_name,row?.mobile2)}><TbPasswordFingerprint />
                            </CustomButton>
                            <CustomButton variant={"yellow"} className="px-2 py-2 text-white rounded-lg font-semibold"><FaEdit /></CustomButton>

                            <CustomButton onClick={()=>astrologerProfile(row?.id)}
                            variant={"red"} className="px-2 py-2 rounded-lg font-semibold"><ImProfile /></CustomButton>
                        </div></li>
                </ul>
            ))}

 {showUpdatePopup && (
                <div className="fixed inset-0 flex justify-center items-center bg-[#0000009a]">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-[400px]">
                        <button onClick={() => setShowUpdatePopup(false)} className="absolute top-2  right-2 text-red-500 text-xl">
                            ✖
                        </button>
                        <h1 className="text-xl font-bold">Active New Account</h1>


                             <div className="flex flex-col mt-4">
                            <label> Astrologer  : {astrodetail?.profilename || ""}</label>
                            
                           
                        </div>
                       
                          <div className="flex flex-col mt-4">
                            <label>Enter Phone Number</label>
                            
                            <div className="flex items-center space-x-2">
                                <input
                                disabled
                                    type="number"
                                    className="border p-2 rounded w-full"
                                    onChange={(e) => setPassword(e.target.value)}
                                 value={astrodetail?.phonenumber}
                                />

                            </div>
                        </div>


                        <div className="flex flex-col mt-4">
                            <label>Enter New Password</label>
                            
                            <div className="flex items-center space-x-2">
                                <input
                                    type="password"
                                    className="border p-2 rounded w-full"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />

                            </div>
                        </div>

                        <div className="flex flex-col mt-4">

                            <div className="flex items-center space-x-2">



                                <CustomButton variant={"red"} onClick={generateAccount}
                                className="px-2 py-2 text-white rounded-lg font-semibold"


                                >Active Account</CustomButton>

                            </div>
                        </div>


                    </div>
                </div>
            )}
<AlertLoading show={accountloading} title="Please Wait..." />
           
        </div>
    );
}
