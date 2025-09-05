import { gql } from '@apollo/client';

export const createVehicleModelMutation = gql`
  mutation Create_vehicle_model(
    $name: String!
    $vehicleTypeId: String!
    $vehicleManufactureId: String!
  ) {
    create_vehicle_model(
      name: $name
      vehicle_type_id: $vehicleTypeId
      vehicle_manufacture_id: $vehicleManufactureId
    ) {
      success
      message
    }
  }
`;

export const updateVehicleModelMutation = gql`
  mutation Update_vehicle_model(
    $updateVehicleModelId: ID!
    $name: String
    $vehicleTypeId: String
    $vehicleManufactureId: String
  ) {
    update_vehicle_model(
      id: $updateVehicleModelId
      name: $name
      vehicle_type_id: $vehicleTypeId
      vehicle_manufacture_id: $vehicleManufactureId
    ) {
      success
      message
    }
  }
`;

export const changeStatusVehicleModelMutation = gql`
  mutation Change_status_vehicle_model($changeStatusVehicleModelId: ID!, $status: STATUS_ENUM!) {
    change_status_vehicle_model(id: $changeStatusVehicleModelId, status: $status) {
      success
      message
    }
  }
`;
