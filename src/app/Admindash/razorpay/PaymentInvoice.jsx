"use client";

import React from "react";

const PaymentInvoice = React.forwardRef(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[210mm] min-h-[297mm] bg-white p-8 text-black text-sm"
    >
      {/* Header */}

      <div className="text-center border-b pb-5">
        <h1 className="text-3xl font-bold text-indigo-700">
          DHWANI ASTRO
        </h1>

        <h2 className="text-xl font-semibold mt-3">
          PAYMENT INVOICE
        </h2>

        <p className="text-gray-500 mt-1">
          Invoice No : {data.invoiceNo}
        </p>

        <p className="text-gray-500">
          Date :
          {" "}
          {new Date(data.createdAt).toLocaleDateString("en-IN")}
        </p>
      </div>

      {/* Customer */}

      <div className="grid grid-cols-2 gap-6 mt-8">

        <div className="border rounded-lg p-4">

          <h3 className="font-bold text-lg mb-3">
            Customer Details
          </h3>

          <p>
            <b>Name :</b> {data.userName}
          </p>

          <p>
            <b>Mobile :</b> {data.mobile}
          </p>

          <p>
            <b>Country :</b> {data.country || "-"}
          </p>

          <p>
            <b>State :</b> {data.state || "-"}
          </p>

          <p>
            <b>City :</b> {data.city || "-"}
          </p>

        </div>

        <div className="border rounded-lg p-4">

          <h3 className="font-bold text-lg mb-3">
            Payment Details
          </h3>

          <p>
            <b>Order ID :</b>
          </p>

          <p className="break-all text-xs">
            {data.razorpayOrderId}
          </p>

          <br />

          <p>
            <b>Payment ID :</b>
          </p>

          <p className="break-all text-xs">
            {data.razorpayPaymentId}
          </p>

          <br />

          <p>
            <b>Status :</b> {data.status}
          </p>

        </div>

      </div>

      {/* Recharge */}

      <div className="mt-8">

        <table className="w-full border border-collapse">

          <thead>

            <tr className="bg-gray-100">

              <th className="border p-2">
                Recharge Pack
              </th>

              <th className="border p-2">
                Coins
              </th>

              <th className="border p-2">
                Amount
              </th>

              <th className="border p-2">
                Taxable
              </th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td className="border p-2">
                {data.rechargePackName}
              </td>

              <td className="border p-2 text-center">
                {data.coins}
              </td>

              <td className="border p-2 text-center">
                ₹{data.amount}
              </td>

              <td className="border p-2 text-center">
                ₹{data.taxableAmount}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      {/* GST */}

      <div className="mt-8">

        <table className="w-full border border-collapse">

          <tbody>

            <tr>

              <td className="border p-2">
                GST Rate
              </td>

              <td className="border p-2">
                {data.gstRate}%
              </td>

            </tr>

            <tr>

              <td className="border p-2">
                CGST
              </td>

              <td className="border p-2">
                ₹{data.cgst}
              </td>

            </tr>

            <tr>

              <td className="border p-2">
                SGST
              </td>

              <td className="border p-2">
                ₹{data.sgst}
              </td>

            </tr>

            <tr>

              <td className="border p-2">
                IGST
              </td>

              <td className="border p-2">
                ₹{data.igst}
              </td>

            </tr>

            <tr>

              <td className="border p-2">
                Total GST
              </td>

              <td className="border p-2">
                ₹{data.totalTax}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      {/* PG Charges */}

      <div className="mt-8">

        <table className="w-full border border-collapse">

          <tbody>

            <tr>

              <td className="border p-2">
                PG Charge Rate
              </td>

              <td className="border p-2">
                {data.pgChargeRate}%
              </td>

            </tr>

            <tr>

              <td className="border p-2">
                PG Charge
              </td>

              <td className="border p-2">
                ₹{data.pgCharge}
              </td>

            </tr>

            <tr>

              <td className="border p-2">
                PG IGST
              </td>

              <td className="border p-2">
                ₹{data.pgIgst}
              </td>

            </tr>

            <tr>

              <td className="border p-2">
                PG Total
              </td>

              <td className="border p-2">
                ₹{data.pgTotal}
              </td>

            </tr>

            <tr className="bg-gray-100 font-bold">

              <td className="border p-2">
                Receivable Amount
              </td>

              <td className="border p-2">
                ₹{data.receivableAmount}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="mt-12 border-t pt-5 text-center text-gray-500 text-xs">

        This is a computer generated invoice.

      </div>

    </div>
  );
});

PaymentInvoice.displayName = "PaymentInvoice";

export default PaymentInvoice;