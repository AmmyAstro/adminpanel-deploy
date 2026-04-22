import { gql } from "@apollo/client";

// 🔥 GET
export const GET_NEW_ASTROLOGERS = gql`
  query {
    getNewAstrologers {
      id
      name
      phoneNumber
      gender
      skills
      experience
      interviewStatus
      interviewer
      interviewDate
      interviewTime
      round
      documentStatus
      approvalStatus
    }
  }
`;

export const GET_PENDING_APPLICATIONS = gql`
  query {
    getPendingApplications {
      id
      name
      phoneNumber
      email
      gender
      skills
      languages
      experience
      createdAt
    }
  }
`;

export const GET_INTERVIEWERS = gql`
  query GetInterviewers {
    getInterviewers {
      id
      name
      email
    }
  }
`;

// 🔥 SCHEDULE
export const SCHEDULE_INTERVIEW = gql`
  mutation (
    $astrologerId: ID!
    $interviewer: String!
    $interviewDate: String!
    $interviewTime: String!
    $round: Int!
  ) {
    scheduleInterview(
      astrologerId: $astrologerId
      interviewer: $interviewer
      interviewDate: $interviewDate
      interviewTime: $interviewTime
      round: $round
    ) {
      id
      interviewStatus
    }
  }
`;

// 🔥 INTERVIEW STATUS
export const UPDATE_INTERVIEW_STATUS = gql`
  mutation ($astrologerId: ID!, $status: String!) {
    updateInterviewStatus(astrologerId: $astrologerId, status: $status) {
      id
      interviewStatus
    }
  }
`;

// 🔥 DOCUMENT STATUS
export const UPDATE_DOCUMENT_STATUS = gql`
  mutation ($astrologerId: ID!, $status: String!) {
    updateDocumentStatus(astrologerId: $astrologerId, status: $status) {
      id
      documentStatus
    }
  }
`;

// 🔥 APPROVAL STATUS
export const UPDATE_APPROVAL_STATUS = gql`
  mutation ($astrologerId: ID!, $status: String!) {
    updateApprovalStatus(astrologerId: $astrologerId, status: $status) {
      id
      approvalStatus
    }
  }
`;
