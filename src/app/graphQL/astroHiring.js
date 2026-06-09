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
    getOffers {
      id
      offerName
      description
      price
      createdAt
      updatedAt
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
    $id: String!
    $offerName: String!
    $price: Float!
    $description: String!
    $isActive: Boolean
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
  mutation DeleteOffer($id: String!) {
    deleteOffer(id: $id) {
      success
      message
    }
  }
`;

export const GET_ASTROLOGER_BY_ID = gql`
  query GetAstrologerById($id: ID!) {
    getAstrologerById(id: $id) {
      id

      name
      displayName
      profilePic
      dateOfBirth

      email
      contactNo

      gender
      experience

      about

      tags
      vtags

      languages
      skills
      problems

      pricing {
        type
        price
        offerPrice
        commissionPercent
        isActive
      }

      kycDetail {
        accountHolderName
        accountNumber
        bankName
        ifsc
        branchName
        panNumber

        profileImage
        aadhaarImage
        panImage
        passbookImage
      }

      addresses {
        street
        city
        state
        country
        pincode
      }
    }
  }
`;
export const UPDATE_ASTROLOGER = gql`
  mutation UpdateAstrologer(
    $astrologerId: ID!
    $data: UpdateAstrologerInput!
  ) {
    updateAstrologer(
      astrologerId: $astrologerId
      data: $data
    ) {
      id
      name
      email
    }
  }
`;