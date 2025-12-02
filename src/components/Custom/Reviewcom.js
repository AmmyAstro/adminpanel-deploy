
"use client";

import React, { useEffect, useMemo } from "react"

import { useSelector, useDispatch } from "react-redux"

import { formatDate } from "@/app/helper/helper";

import AlertLoading from "@/app/common/AlertLoading";
import { fetchReview } from "@/app/redux/slices/astrologer/getReview";




function Reviewcom({astro_id}) {


    const { review, loading, currentPage, totalPages } = useSelector((state) => state.reviewhistory);




    const dispatch = useDispatch();



    const review_data = useMemo(() => review, [review]);






    useEffect(() => {
        dispatch(fetchReview({ astro_id, limit: 12, page: currentPage }))

    }, [dispatch, currentPage,astro_id]);




    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(
                fetchReview({
                    astro_id,
                    limit: 12,
                    page: newPage,
                })
            );
        }
    };





    return (
        <div>

            <ul className="grid w-full grid-cols-8 place-self-center items-center justify-center place-center self-center font-bold bg-purple-200 rounded-md p-2 text-sm text-purple-900">
                <li className="text-center"> S No</li>
                <li className="text-center"> Order ID</li>
                <li className="text-center">Type</li>
                <li className="text-center">Review</li>
                <li className="text-center">Reply</li>
                  <li className="text-center">Star</li>
                <li className="text-center">UserName</li>
              
                <li className="text-center">Date</li>

               

                {/* <li className="text-center">Action</li> */}
            </ul>

            <AlertLoading show={loading} title="Please Wait.." />
            {review_data?.map((tx, index) => (
                <ul
                    key={index}
                    className="grid grid-cols-8 border-b border-gray-200 text-xs text-gray-700 p-2 hover:bg-gray-50"
                >
                    <li className="text-center">{index + 1}</li>
                    <li className="text-center text-green-600 font-medium">{tx?.review_id}</li>

                    <li className="text-center"> {tx?.type}</li>
            

                    <li> {tx?.comment || "N/A"}</li>

                    <li> {tx?.reply_to || "N/A"}</li>
                    
              <li className="text-center"> {tx?.star || "N/A"}</li>


                    <li className="text-center">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
<span>
    {tx?.user_name}
</span>

<span className="text-red-600 font-medium">
 ( Id:{tx?.id})
</span>

                                {/* {tx.transaction_type === "credit" && (
                                    <span className="text-green-600 font-medium">(credit)</span>
                                )}
                                {tx.transaction_type === "debit" && (
                                    <span className="text-red-600 font-medium">(debit)</span>
                                )} */}

                            </div>
                        </div>
                    </li>

                    <li className="text-center">{formatDate(tx?.created_at)}</li>



                  






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

export default React.memo(Reviewcom);
