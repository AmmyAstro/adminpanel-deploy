
'use client'

import React, { useEffect, useMemo } from "react"
import CustomButton from "./CustomButtom"
import { useSelector, useDispatch } from "react-redux"
import { fetchMessages } from "@/app/redux/slices/chathistory/chatHistorySlice";
import { formatDate } from "@/app/helper/helper";
import CustomToggle from "./CustomToggle";
import AlertLoading from "@/app/common/AlertLoading";


function ChatCom({astro_id}) {



    const { messages, loading, error, currentPage, totalPages } = useSelector(
        (state) => state.chathistory
    );

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(
            fetchMessages({
                astrologer_id: astro_id,
                limit: 12,
                page: currentPage,
            })
        );
    }, [dispatch, currentPage,astro_id]);

    const chatdata = useMemo(() => messages, [messages]);


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(
                fetchMessages({
                    astrologer_id: astro_id,
                    limit: 12,
                    page: newPage,
                })
            );
        }
    };





    return (
        <div>

            <ul className="grid w-full grid-cols-8 place-self-center items-center justify-center place-center self-center font-bold bg-purple-200 rounded-md p-2 text-sm text-purple-900">
                <li className="text-center">S.No</li>
                <li className="text-center">Chat Id</li>
                <li className="text-center">User</li>
                <li className="text-center">Duration</li>
                <li className="text-center">Astro Price</li>
                <li className="text-center">Type</li>
                <li className="text-center">Date</li>
                <li className="text-center">Action</li>
            </ul>

            <AlertLoading show={loading} title="Please Wait.." />
            {chatdata.map((item, index) => (
                <ul
                    key={index}
                    className="grid grid-cols-8 border-b border-gray-200 text-xs text-gray-700 p-2 hover:bg-gray-50"
                >
                    <li className="text-center">{(currentPage - 1) * 12 + (index + 1)}</li>

                    <li className="text-center">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                                <span className="">{item?.request_session_id}</span>

                                {item?.request_status === 4 && (
                                    <span className="text-red-600 font-medium">(Reject)</span>
                                )}
                                {item?.request_status === 5 && (
                                    <span className="text-green-600 font-medium">(Complete)</span>
                                )}
                                {item?.request_status === 2 && (
                                    <span className="text-green-600 font-medium">(Processing)</span>
                                )}
                            </div>
                        </div>
                    </li>

                    <li className="text-center">{item?.user_name}</li>

                    <li className="text-center">{item?.duration}</li>

                    <li className="text-center">

                        <div className="flex flex-col gap-1">

                            {
                                item?.is_promotional === 0 &&
                                "₹ 0.00"

                            }


                            {item?.is_promotional === 1 && "₹ 5.00"}

                            {item?.is_promotional === 2 && (
                                <span>₹{item?.astro_charge}.00</span>
                            )}
                        </div>



                        <span className="text-red-600 font-medium">({item?.astro_deduction})</span>



                    </li>

                    <li className="text-center">
                        {item?.is_promotional === 0 && (
                            <span className="text-yellow-600 font-medium">Free</span>
                        )}
                        {item?.is_promotional === 1 && (
                            <span className="text-red-600 font-medium">Offer</span>
                        )}
                        {item?.is_promotional === 2 && (
                            <span className="text-green-600 font-medium">Paid</span>
                        )}
                    </li>

                    <li className="text-center">{formatDate(item?.created_at)}</li>

                    <li className="text-center">
                        <div className="flex items-center justify-center">
                            <CustomToggle id="chat" checked={true} />
                        </div>
                    </li>
                </ul>
            ))}


            <div className="flex justify-center items-center gap-3 mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1 bg-purple-300 rounded disabled:bg-gray-300"
                >
                    Prev
                </button>

                <span className="font-semibold">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1 bg-purple-300 rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default React.memo(ChatCom);
