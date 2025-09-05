import { gql } from '@apollo/client';

export const createVehicleManufactureMutation = gql`
  mutation Create_vehicle_manufacture($name: String!) {
    create_vehicle_manufacture(name: $name) {
      success
      message
    }
  }
`;

export const updateVehicleManufactureMutation = gql`
  mutation Update_vehicle_manufacture($updateVehicleManufactureId: ID!, $name: String) {
    update_vehicle_manufacture(id: $updateVehicleManufactureId, name: $name) {
      success
      message
    }
  }
`;

export const changeStatusVehicleManufactureMutation = gql`
  mutation Change_status_vehicle_manufacture(
    $changeStatusVehicleManufactureId: ID!
    $status: STATUS_ENUM!
  ) {
    change_status_vehicle_manufacture(id: $changeStatusVehicleManufactureId, status: $status) {
      success
      message
    }
  }
`;
