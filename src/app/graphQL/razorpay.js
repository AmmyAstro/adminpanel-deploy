import { gql } from "@apollo/client";

export const GET_PAYMENT_REPORTS = gql`
    query GetPaymentReports(
        $searchInput: PaymentReportSearchInput!
    ) {
        getPaymentReports(searchInput: $searchInput) {
            totalCount
            currentPage
            totalPages
            totalAmount
            totalCoins
            paidAmount
            failedAmount
            paidCount
            failedCount

            data {
                id
                userId
                userName
                mobile
                rechargePackId
                rechargePackName
                razorpayOrderId
                amount
                coins
                status
                createdAt
                updatedAt
            }
        }
    }
`;