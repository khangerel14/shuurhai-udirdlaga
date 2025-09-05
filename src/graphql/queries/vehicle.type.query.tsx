import { gql } from '@apollo/client';

import { subUserModel } from '../models/user';

export const getVehicleTypesQuery = gql`
  query Get_vehicle_types(
    $getVehicleTypesId: String
    $name: String
    $status: STATUS_FILTER
    $page: Int
    $limit: Int
    $order: String
    $sort: String
  ) {
    get_vehicle_types(
      id: $getVehicleTypesId
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
