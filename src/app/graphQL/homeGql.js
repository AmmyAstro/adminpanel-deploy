import { gql } from "@apollo/client";

export const GET_GIFTS = gql`
  query {
    getGifts {
      id
      name
      amount
      image
      status
    }
  }
`;

export const CREATE_GIFT = gql`
  mutation ($input: GiftInput!) {
    createGift(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_GIFT = gql`
  mutation ($id: ID!, $input: GiftInput!) {
    updateGift(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const DELETE_GIFT = gql`
  mutation ($id: ID!) {
    deleteGift(id: $id)
  }
`;