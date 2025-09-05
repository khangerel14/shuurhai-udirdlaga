import { gql } from '@apollo/client';

import { userModel } from '../models/user';

export const getUserQuery = gql`
  query Get_user_info {
    get_user_info {
      success
      message
      user {
        ${userModel}
      }
    }
  }
`;

export const getUsersQuery = gql`
  query Get_users(
    $email: String
    $phoneNumber: String
    $status: STATUS_FILTER
    $role: ROLE
    $page: Int
    $limit: Int
    $order: String
    $sort: String
  ) {
    get_users(
      email: $email
      phoneNumber: $phoneNumber
      status: $status
      role: $role
      page: $page
      limit: $limit
      order: $order
      sort: $sort
    ) {
      success
      message
      users {
        ${userModel}
      }
      count
    }
  }
`;
