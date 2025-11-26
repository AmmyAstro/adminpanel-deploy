import React, { useEffect } from "react"
import CustomButton from "./CustomButtom"
import { useSelector,useDispatch } from "react-redux"
import { fetchMessages } from "@/app/redux/slices/chathistory/chatHistorySlice";



function CallComp() {


    const dispatch= useDispatch();

    useEffect(()=>{
 
     dispatch(fetchMessages({
        astrologer_id:1,
        limit:12,
        page:1
     }))
    },[dispatch])




    return (
        <div>
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

            <ul
                // key={row.id}
                className="grid grid-cols-8 border-b border-gray-200 text-sm text-gray-700 p-2 hover:bg-gray-50">
                <li>hgtght</li>

                <li>     <div className="flex items-center gap-2">

                    <div className="flex flex-col gap-1">
                        <span className="text-sm">akash</span>

                    </div>
                </div></li>
                <li className="line-clamp-2  text-ellipsis ">akash</li>

                <li>
                    <CustomButton variant={"black"} className="px-2 py-2 text-white rounded-lg font-semibold">
                        akash
                    </CustomButton>
                </li>


                <li>
                    <div className="flex flex-col gap-1">

                        akash



                    </div>
                </li>
                <li>
                    akash


                </li>


                <li>
                    <div className="flex items-center justify-center gap-3 text-xs">

                        23/11/25 10:20 am

                    </div></li>


                <li>
                    <div className="flex items-center justify-center gap-3 text-xs">

                        akash
                    </div>
                </li>
            </ul>
        </div>
    )
}



export default React.memo(CallComp)