import { gql } from "@apollo/client";


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


export const GET_INTERVIEWERS = gql`
  query {
    getInterviewers {
      id
      name
      email
    }
  }
`;


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


export const UPDATE_DOCUMENT_STATUS = gql`
  mutation ($astrologerId: ID!, $status: DocumentStatus!) {
    updateDocumentStatus(astrologerId: $astrologerId, status: $status) {
      id
      documentStatus
    }
  }
`;


export const UPDATE_APPROVAL_STATUS = gql`
  mutation ($astrologerId: ID!, $status: ApprovalStatus!) {
    updateApprovalStatus(astrologerId: $astrologerId, status: $status) {
      id
      approvalStatus
    }
  }
`;


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
      data: { offerName: $offerName, price: $price, description: $description }
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
      isCallActive
      isChatActive
      isLiveActive
      isBusy
      isOnline
      isPromotional

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
  mutation UpdateAstrologer($astrologerId: ID!, $data: UpdateAstrologerInput!) {
    updateAstrologer(astrologerId: $astrologerId, data: $data) {
      id
      name
      email
    }
  }
`;

export const GET_CATEGORIES = gql`
  query getCategories {
    getCategories {
      id
      name
      slug
      image
    }
  }
`;
export const DELETE_CATEGORY = gql`
  mutation ($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const GET_ASTROLOGER_DASHBOARD_STATS = gql`
  query GetAstrologerDashboardStats($astrologerId: ID!) {
    getAstrologerDashboardStats(astrologerId: $astrologerId) {
      totalChats
      totalCalls
      totalSessions

      totalCoinsEarned
      totalCoinsDeducted
      totalCommission

      totalDurationMinutes

      walletBalance
      totalEarned
      totalWithdrawn

      totalFollowers
      totalReviews

      averageRating
    }
  }
`;

export const GET_ASTROLOGER_CHAT_HISTORY = gql`
  query GetAstrologerChatHistory($astrologerId: ID!, $page: Int, $limit: Int) {
    getAstrologerChatHistory(
      astrologerId: $astrologerId
      page: $page
      limit: $limit
    ) {
      totalCount

      currentPage

      totalPages

      data {
        sessionId

        userName

        ratePerMin

        durationSec

        coinsEarned

        coinsDeducted

        status

        createdAt
      }
    }
  }
`;

export const GET_ASTROLOGER_CALL_HISTORY = gql`
  query GetAstrologerCallHistory($astrologerId: ID!, $page: Int, $limit: Int) {
    getAstrologerCallHistory(
      astrologerId: $astrologerId
      page: $page
      limit: $limit
    ) {
      totalCount

      currentPage

      totalPages

      data {
        sessionId

        userName

        ratePerMin

        durationSec

        coinsEarned

        coinsDeducted

        status

        createdAt
      }
    }
  }
`;

export const UPDATE_AVAILABILITY = gql`
  mutation UpdateAvailability(
    $astrologerId: ID!
    $isChatActive: Boolean
    $isCallActive: Boolean
    $isLiveActive: Boolean
    $isPromotional: Boolean
  ) {
    updateAstrologerAvailability(
      astrologerId: $astrologerId
      isChatActive: $isChatActive
      isCallActive: $isCallActive
      isLiveActive: $isLiveActive
      isPromotional: $isPromotional
    ) {
      id
      isChatActive
      isCallActive
      isLiveActive
      isPromotional
    }
  }
`;

export const TOGGLE_REVIEW_FLAG = gql`
  mutation ToggleReviewFlag($reviewId: ID!, $isFlagged: Boolean!) {
    toggleReviewFlag(reviewId: $reviewId, isFlagged: $isFlagged) {
      success
      message
    }
  }
`;

export const GET_USER_CALL_HISTORY = gql`
  query GetUserCallHistory($searchInput: UserCallHistorySearchInput!) {
    getUserCallHistory(searchInput: $searchInput) {
      totalCount
      currentPage
      totalPages

      totalCoinsDeducted
      totalCoinsEarned
      totalCommission

      data {
        sessionId

        userId
        userName
        mobile

        astrologerId
        astrologerName

        type
        status

        ratePerMin
        durationSec

        coinsDeducted
        coinsEarned
        commission

        startedAt
        endedAt
        createdAt
      }
    }
  }
`;

export const GET_USERS_CHAT_HISTORY = gql`
  query GetUsersChatHistory($searchInput: UserChatHistorySearchInput!) {
    getUsersChatHistory(searchInput: $searchInput) {
      totalCount
      currentPage
      totalPages

      totalCoinsDeducted
      totalCoinsEarned
      totalCommission

      data {
        userId
        sessionId
        userName
        mobile
        astrologerName

        status
        ratePerMin
        coinsDeducted
        coinsEarned
        commission

        durationSec
        createdAt
      }
    }
  }
`;

export const GET_ASTRO_LIST = gql`
  query GetAstrologerList($searchInput: AstrologerSearchInput!) {
    getAstrologerListBySearch(searchInput: $searchInput) {
      data {
        id
        displayName
        email
        contactNo
        experience
        tags
        vtags
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    getUserProfile(userId: $userId) {
      id
      name

      mobile
      countryCode

      gender

      birthDate
      birthTime

      occupation

      isActive

      createdAt

      stats {
        walletBalance

        totalRecharge
        totalRechargeCount

        totalCalls
        totalChats

        totalReviews

        totalFollowing

        totalBookings

        lastRechargeAmount
        lastRechargeDate
      }
    }
  }
`;

export const CREATE_NOTICE = gql`
  mutation CreateNotice($input: CreateNoticeInput!) {
    createNotice(input: $input) {
      id
      title
    }
  }
`;

export const UPDATE_NOTICE = gql`
  mutation UpdateNotice($id: ID!, $input: UpdateNoticeInput!) {
    updateNotice(id: $id, input: $input) {
      id
      title
      isActive
    }
  }
`;
export const DELETE_NOTICE = gql`
  mutation DeleteNotice($id: ID!) {
    deleteNotice(id: $id)
  }
`;

export const GET_NOTICES = gql`
  query GetNotices {
    getNotices {
      id
      title
      description
      targetType
      isActive
      createdAt

      astrologers {
        id
        name
        displayName
      }
    }
  }
`;
export const UPDATE_REVIEW_COMMENT = gql`
  mutation UpdateReviewComment(
    $reviewId: ID!
    $comment: String!
  ) {
    updateReviewComment(
      reviewId: $reviewId
      comment: $comment
    ) {
      reviewId
      comment
    }
  }
`;
export const UPDATE_GIFT_STATUS = gql`
  mutation UpdateGiftStatus(
    $id: ID!
    $status: String!
  ) {
    updateGiftStatus(
      id: $id
      status: $status
    ) {
      id
      status
    }
  }
`;