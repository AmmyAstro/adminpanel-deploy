import { gql } from "@apollo/client";

export const GET_ABOUT_PAGE = gql`
  query GetAboutPage {
    getAboutPage {
      id
      pageType

      heroTitle
      heroDescription

      mentors
      founders

      metaTitle
      metaDescription
      keywords

      status

      createdAt
      updatedAt
    }
  }
`;

export const UPSERT_ABOUT_PAGE = gql`
  mutation UpsertAboutPage(
    $input: UpdateAboutPageInput!
  ) {
    upsertAboutPage(input: $input) {
      id
      heroTitle
      status
    }
  }
`;

export const GET_PRIVACY_PAGE = gql`

  query GetPrivacyPage {

    getPrivacyPage {

      id

      title

      content

      metaTitle

      metaDescription

      keywords

      status

    }

  }

`;

export const UPSERT_PRIVACY_PAGE = gql`

  mutation UpsertPrivacyPage(
    $input: UpdatePrivacyPageInput!
  ) {

    upsertPrivacyPage(input: $input) {

      id

      title

      status

    }

  }

`;

export const GET_REFUND_POLICY_PAGE = gql`

  query GetRefundPolicyPage {

    getRefundPolicyPage {

      id

      title

      content

      metaTitle

      metaDescription

      keywords

      status

    }

  }

`;

export const UPSERT_REFUND_POLICY_PAGE = gql`

  mutation UpsertRefundPolicyPage(
    $input: UpdateRefundPolicyPageInput!
  ) {

    upsertRefundPolicyPage(
      input: $input
    ) {

      id

      title

      status

    }

  }

`;
export const GET_DISCLAIMER_PAGE = gql`

  query GetDisclaimerPage {

    getDisclaimerPage {

      id

      title

      content

      metaTitle

      metaDescription

      keywords

      status

    }

  }

`;

export const UPSERT_DISCLAIMER_PAGE = gql`

  mutation UpsertDisclaimerPage(
    $input: UpdateDisclaimerPageInput!
  ) {

    upsertDisclaimerPage(
      input: $input
    ) {

      id

      title

      status

    }

  }

`;



export const GET_REMEDIES = gql`

  query GetRemedies {

    getRemedies {

      id

      title

      description

      isActive

      createdAt

    }

  }

`;

export const GET_REMEDY_BY_ID = gql`

  query GetRemedyById(
     $id: ID!
  ) {

    getRemedyById(id: $id) {

      id

      title

      description

      isActive

    }

  }

`;

export const CREATE_REMEDY = gql`

  mutation CreateRemedy(
    $input: CreateRemedyInput!
  ) {

    createRemedy(input: $input) {

      id

      title

    }

  }

`;

export const UPDATE_REMEDY = gql`

  mutation UpdateRemedy(
     $id: ID!
    $input: UpdateRemedyInput!
  ) {

    updateRemedy(
      id: $id
      input: $input
    ) {

      id

      title

      isActive

    }

  }

`;

export const DELETE_REMEDY = gql`

  mutation DeleteRemedy(
    $id: ID!
  ) {

    deleteRemedy(id: $id)

  }

`;