import { gql } from '@apollo/client';

import { subUserModel } from '../models/user';

export const getCitiesQuery = gql`
  query Get_cities(
    $getCitiesId: String
    $name: String
    $status: STATUS_FILTER
    $page: Int
    $limit: Int
    $order: String
    $sort: String
  ) {
    get_cities(
      id: $getCitiesId
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
        status
        createdUser {
            ${subUserModel}
        }
        updatedUser {
            ${subUserModel}
        }
        createdAt
        updatedAt
      }
      count
    }
  }
`;
