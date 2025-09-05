import { gql } from '@apollo/client';

import { subUserModel } from '../models/user';

export const getVehicleManufactureQuery = gql`
  query Get_vehicle_manufactures(
    $getVehicleManufacturesId: String
    $name: String
    $status: STATUS_FILTER
    $page: Int
    $limit: Int
    $order: String
    $sort: String
  ) {
    get_vehicle_manufactures(
      id: $getVehicleManufacturesId
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
