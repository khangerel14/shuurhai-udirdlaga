import { gql } from '@apollo/client';

export const signInMutation = gql`
  mutation Sign_in_by_admin($email: String!, $password: String!) {
    sign_in_by_admin(email: $email, password: $password) {
      success
      message
      user {
        id
        firstName
        lastName
        email
        emailVerified
        phoneNumber
        phoneVerified
        avatar
        birthday
        status
        role
        gender
        createdUser {
          id
          firstName
          lastName
          email
          emailVerified
          phoneNumber
          phoneVerified
          avatar
          birthday
          status
          role
          gender
          createdAt
          updatedAt
        }
        updatedUser {
          id
          firstName
          lastName
          email
          emailVerified
          phoneNumber
          phoneVerified
          avatar
          birthday
          status
          role
          gender
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      token
    }
  }
`;

export const createUserMutation = gql`
  mutation Create_user(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $role: ROLE!
    $avatar: String
  ) {
    create_user(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      role: $role
      avatar: $avatar
    ) {
      success
      message
    }
  }
`;

export const updateUserMutation = gql`
  mutation Update_user(
    $updateUserId: ID!
    $phoneNumber: String
    $avatar: String
    $firstName: String
    $lastName: String
    $gender: GENDER_ENUM
  ) {
    update_user(
      id: $updateUserId
      phoneNumber: $phoneNumber
      avatar: $avatar
      firstName: $firstName
      lastName: $lastName
      gender: $gender
    ) {
      success
      message
    }
  }
`;

export const changeStatusUser = gql`
  mutation Change_status_user($changeStatusUserId: ID!, $status: STATUS_ENUM!) {
    change_status_user(id: $changeStatusUserId, status: $status) {
      success
      message
    }
  }
`;
