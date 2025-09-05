import { gql } from '@apollo/client';

import { cityModel } from '../models/city';
import { subUserModel } from '../models/user';

export const getDistrictsQuery = gql`
  query Get_districts(
    $getDistrictsId: String
    $name: String
    $cityId: String
    $status: STATUS_FILTER
    $page: Int
    $limit: Int
    $order: String
    $sort: String
  ) {
    get_districts(
      id: $getDistrictsId
      name: $name
      city_id: $cityId
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
        city {
            ${cityModel}
        }
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
