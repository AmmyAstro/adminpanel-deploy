'use client'

import React, { useEffect, useMemo } from "react"

import { useSelector, useDispatch } from "react-redux"

import { formatDate } from "@/app/helper/helper";

import AlertLoading from "@/app/common/AlertLoading";

import { fetchGiftsRequest } from "@/app/redux/slices/gift/giftSlice";



function GiftComp() {

    const { loading, gifts } = useSelector((state) => state.gift);





    const giftlist = useMemo(() => {

        return gifts;

    }, [gifts])


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGiftsRequest({ astro_id: 1 }))
    }, [dispatch])
    return (
        <div>

            <ul className="grid w-full grid-cols-8 place-self-center items-center justify-center place-center self-center font-bold bg-purple-200 rounded-md p-2 text-sm text-purple-900">
                <li className="text-center">S.No</li>
                <li className="text-center">GiftId</li>
                <li className="text-center">UserName</li>
                <li className="text-center">Gift Name</li>
                <li className="text-center">Gift Price</li>
                <li className="text-center">Type</li>
                <li className="text-center">Status</li>
                <li className="text-center">Date</li>

            </ul>

            <AlertLoading show={loading} title="Please Wait.." />
            {giftlist?.map((item, index) => (
                <ul
                    key={index}
                    className="grid grid-cols-8 border-b border-gray-200 text-xs text-gray-700 p-2 hover:bg-gray-50"
                >
                    <li className="text-center ">{(index + 1)}</li>

                    <li className="text-center">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                                <span className="">gift#-{item?.id}</span>


                            </div>
                        </div>
                    </li>

                    <li className="text-center">{item?.user_name}</li>

                    <li className="text-center">{item?.giftname}</li>

                    <li className="text-center">
                        ₹{item?.giftprice}.00







                    </li>

                    <li className="text-center flex flex-col gap-1">

                        <span className="text-red-600 font-medium">Profile</span>






                    </li>

                    <li className="text-center">

                        <span className="text-green-600 font-medium">Complete</span>



                    </li>

                    <li className="text-center">{formatDate(item?.created_at)}</li>


                </ul>
            ))}



        </div>
    );
}

export default React.memo(GiftComp);
