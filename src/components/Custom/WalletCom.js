import React, { useEffect, useMemo } from "react"

import { useSelector, useDispatch } from "react-redux"

import { formatDate } from "@/app/helper/helper";
import CustomToggle from "./CustomToggle";
import AlertLoading from "@/app/common/AlertLoading";
import { fetchcallHistory } from "@/app/redux/slices/callhistory/getCallHistory";
import { fetchWalletRequest } from "@/app/redux/slices/wallet/WalletSlice";


function WalletCom() {


    const { transactions, loading: callloading, currentPage, totalPages, balance } = useSelector((state) => state.astrologerWallet);




    const dispatch = useDispatch();



    const wallet_data = useMemo(() => transactions, [transactions]);


    console.log("xaDSASD", wallet_data);

    useEffect(() => {
        dispatch(fetchWalletRequest({ astrologer_id: 1, limit: 12, page: currentPage }))

    }, [dispatch, currentPage]);




    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(
                fetchWalletRequest({
                    astrologer_id: 1,
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
                <li className="text-center">Category</li>
                <li className="text-center">Amount</li>
                <li className="text-center">Duration</li>
                <li className="text-center">Type</li>
                <li className="text-center">Date</li>

                <li className="text-center">Remark</li>

                {/* <li className="text-center">Action</li> */}
            </ul>

            <AlertLoading show={callloading} title="Please Wait.." />
            {wallet_data?.map((tx, index) => (
                <ul
                    key={index}
                    className="grid grid-cols-8 border-b border-gray-200 text-xs text-gray-700 p-2 hover:bg-gray-50"
                >
                    <li className="text-center">{index + 1}</li>
                    <li className="text-center">{tx?.transaction_id}</li>

                    <li className="text-center"> {tx?.type}</li>
                    <li className="text-center">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-center">  ₹{" "}
                                    {Number(tx?.amount).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}



                                </span>


                            </div>
                        </div>
                    </li>

                    <li> {tx?.chat_time || "N/A"}</li>

                    <li className="text-center">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">


                                {tx.transaction_type === "credit" && (
                                    <span className="text-green-600 font-medium">(credit)</span>
                                )}
                                {tx.transaction_type === "debit" && (
                                    <span className="text-red-600 font-medium">(debit)</span>
                                )}

                            </div>
                        </div>
                    </li>

                    <li className="text-center">{formatDate(tx?.created_at)}</li>



                    <li className="text-center">

                        <div className="flex flex-col gap-1">

                            {tx.remarks || tx.refund_reason || tx?.transaction_by}
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

export default React.memo(WalletCom);
