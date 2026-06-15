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
  mutation UpsertAboutPage($input: UpdateAboutPageInput!) {
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
  mutation UpsertPrivacyPage($input: UpdatePrivacyPageInput!) {
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
  mutation UpsertRefundPolicyPage($input: UpdateRefundPolicyPageInput!) {
    upsertRefundPolicyPage(input: $input) {
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
  mutation UpsertDisclaimerPage($input: UpdateDisclaimerPageInput!) {
    upsertDisclaimerPage(input: $input) {
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
  query GetRemedyById($id: ID!) {
    getRemedyById(id: $id) {
      id

      title

      description

      isActive
    }
  }
`;

export const CREATE_REMEDY = gql`
  mutation CreateRemedy($input: CreateRemedyInput!) {
    createRemedy(input: $input) {
      id

      title
    }
  }
`;

export const UPDATE_REMEDY = gql`
  mutation UpdateRemedy($id: ID!, $input: UpdateRemedyInput!) {
    updateRemedy(id: $id, input: $input) {
      id

      title

      isActive
    }
  }
`;

export const DELETE_REMEDY = gql`
  mutation DeleteRemedy($id: ID!) {
    deleteRemedy(id: $id)
  }
`;

export const CREATE_BLOG = gql`
  mutation CreateBlog($input: CreateBlogInput!) {
    createBlog(input: $input) {
      id
      title
      slug
    }
  }
`;
export const GET_BLOGS = gql`
  query GetBlogs {
    blogs {
      id
      title
      slug

      shortDescription

      featuredImage
      content

      publishDate

      status

      createdAt

      categories {
        id
        name
      }
    }
  }
`;

export const CREATE_BLOG_CATEGORY = gql`
  mutation CreateBlogCategory($input: CreateBlogCategoryInput!) {
    createBlogCategory(input: $input) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_BLOG_CATEGORY = gql`
  mutation UpdateBlogCategory($id: ID!, $input: CreateBlogCategoryInput!) {
    updateBlogCategory(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`;

export const DELETE_BLOG_CATEGORY = gql`
  mutation DeleteBlogCategory($id: ID!) {
    deleteBlogCategory(id: $id)
  }
`;
export const GET_BLOG_CATEGORIES = gql`
  query GetBlogCategories {
    blogCategories {
      id
      name
      slug
    }
  }
`;
export const DELETE_BLOG = gql`
  mutation DeleteBlog($id: ID!) {
    deleteBlog(id: $id)
  }
`;

export const GET_BLOG_BY_SLUG = gql`
  query GetBlogBySlug($slug: String!) {
    blogBySlug(slug: $slug) {
      id
      title
      slug
      shortDescription
      content
      featuredImage
      createdAt

      categories {
        id
        name
      }
    }
  }
`;
