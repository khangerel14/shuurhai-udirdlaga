import { gql } from '@apollo/client';

import { subUserModel } from '../models/user';
import { vehicleType, vehicleManufacture } from '../models/vehicle';

export const getVehicleModelsQuery = gql`
  query Get_vehicle_models(
    $getVehicleModelsId: String
    $name: String
    $vehicleTypeId: String
    $vehicleManufactureId: String
    $status: STATUS_FILTER
    $page: Int
    $limit: Int
    $order: String
    $sort: String
  ) {
    get_vehicle_models(
      id: $getVehicleModelsId
      name: $name
      vehicle_type_id: $vehicleTypeId
      vehicle_manufacture_id: $vehicleManufactureId
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
        vehicleType {
          ${vehicleType}
        }
        vehicleManufacture {
          ${vehicleManufacture}
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
