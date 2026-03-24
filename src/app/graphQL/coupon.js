import { gql } from "@apollo/client";

export const GET_COUPONS = gql`
  query GetCoupons {
    getCoupons {
      id
      code
      description
      applicable
      type
      status
      visibility
      percentage
      max_discount
      redeem_limit
      start_date
      end_date
    }
  }
`;

export const CREATE_COUPON = gql`
  mutation CreateCoupon($input: CreateCouponInput!) {
    createCoupon(input: $input) {
      id
      code
    }
  }
`;

export const DELETE_COUPON = gql`
  mutation DeleteCoupon($id: ID!) {
    deleteCoupon(id: $id)
  }
`;

export const UPDATE_COUPON_STATUS = gql`
  mutation UpdateCouponStatus($id: ID!, $status: String!) {
    updateCouponStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;