import { gql } from '@apollo/client';

export const getDriverTypesQuery = gql`
  query Get_driver_types(
    $getDriverTypesId: String
    $name: String
    $status: STATUS_FILTER
    $page: Int
    $limit: Int
    $order: String
    $sort: String
  ) {
    get_driver_types(
      id: $getDriverTypesId
      name: $name
      status: $status
      page: $page
      limit: $limit
      order: $order
      sort: $sort
    ) {
      success
      message
      datas {
        id
        name
        description
        icon
        status
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
      count
    }
  }
`;
