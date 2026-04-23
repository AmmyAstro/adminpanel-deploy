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
      experience

      applicationStatus
      interviewStatus
      documentStatus
      approvalStatus

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