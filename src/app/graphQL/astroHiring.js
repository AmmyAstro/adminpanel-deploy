import { gql } from "@apollo/client";

// 🔥 GET ALL APPLICATIONS (single source of truth)
export const GET_APPLICATIONS = gql`
  query {
    getApplications {
      id
      name
      phoneNumber
      email
      gender
      skills
      languages
      problems
      experience

      applicationStatus
      interviewStatus
      documentStatus
      approvalStatus
      interviewerId
      interviewDate
      interviewTime
      round

      createdAt
    }
  }
`;

// 🔥 INTERVIEWERS
export const GET_INTERVIEWERS = gql`
  query {
    getInterviewers {
      id
      name
      email
    }
  }
`;

// 🔥 SCHEDULE INTERVIEW
export const SCHEDULE_INTERVIEW = gql`
  mutation (
    $astrologerId: ID!
    $interviewerId: String!
    $interviewDate: String!
    $interviewTime: String!
    $round: Int!
  ) {
    scheduleInterview(
      astrologerId: $astrologerId
      interviewerId: $interviewerId
      interviewDate: $interviewDate
      interviewTime: $interviewTime
      round: $round
    ) {
      id
      interviewStatus
      interviewDate
      interviewTime
      round
    }
  }
`;

// 🔥 DOCUMENT STATUS
export const UPDATE_DOCUMENT_STATUS = gql`
  mutation ($astrologerId: ID!, $status: DocumentStatus!) {
    updateDocumentStatus(astrologerId: $astrologerId, status: $status) {
      id
      documentStatus
    }
  }
`;

// 🔥 APPROVAL STATUS
export const UPDATE_APPROVAL_STATUS = gql`
  mutation ($astrologerId: ID!, $status: ApprovalStatus!) {
    updateApprovalStatus(astrologerId: $astrologerId, status: $status) {
      id
      approvalStatus
    }
  }
`;


// docs uload 
export const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file) {
      url
      filename
    }
  }
`;

export const SAVE_AND_VERIFY_KYC = gql`
  mutation SaveAndVerifyKyc(
    $astrologerId: ID!
    $accountHolderName: String
    $accountNumber: String
    $bankName: String
    $ifsc: String
    $branchName: String
    $panNumber: String
    $profileImage: String
    $aadhaarImage: String
    $panImage: String
    $passbookImage: String
    $status: DocumentStatus!
  ) {
    saveAndVerifyKyc(
      astrologerId: $astrologerId
      accountHolderName: $accountHolderName
      accountNumber: $accountNumber
      bankName: $bankName
      ifsc: $ifsc
      branchName: $branchName
      panNumber: $panNumber
      profileImage: $profileImage
      aadhaarImage: $aadhaarImage
      panImage: $panImage
      passbookImage: $passbookImage
      status: $status
    ) {
      id
    }
  }
`;

export const REJECT_KYC = gql`
  mutation RejectKyc($astrologerId: ID!) {
    rejectKyc(astrologerId: $astrologerId) {
      id
      status
    }
  }
`;



export const GET_OFFERS = gql`
  query GetOffers {
    offers {
      id
      offerName
      price
      description
      isActive
      createdAt
    }
  }
`;

export const CREATE_OFFER = gql`
  mutation CreateOffer(
    $offerName: String!
    $price: Float!
    $description: String!
  ) {
    createOffer(
      data: {
        offerName: $offerName
        price: $price
        description: $description
      }
    ) {
      success
      message
      data {
        id
      }
    }
  }
`;

export const UPDATE_OFFER = gql`
  mutation UpdateOffer(
    $id: ID!
    $offerName: String!
    $price: Float!
    $description: String!
    $isActive: Boolean!
  ) {
    updateOffer(
      id: $id
      data: {
        offerName: $offerName
        price: $price
        description: $description
        isActive: $isActive
      }
    ) {
      success
      message
    }
  }
`;

export const DELETE_OFFER = gql`
  mutation DeleteOffer($id: ID!) {
    deleteOffer(id: $id) {
      success
      message
    }
  }
`;
