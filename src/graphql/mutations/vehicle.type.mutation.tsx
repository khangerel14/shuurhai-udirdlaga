import { gql } from '@apollo/client';

export const changeStatusVehicleTypeMutation = gql`
  mutation Change_status_vehicle_type($changeStatusVehicleTypeId: ID!, $status: STATUS_ENUM!) {
    change_status_vehicle_type(id: $changeStatusVehicleTypeId, status: $status) {
      success
      message
    }
  }
`;

export const createVehicleTypeMutation = gql`
  mutation Create_vehicle_type($name: String!) {
    create_vehicle_type(name: $name) {
      success
      message
    }
  }
`;

export const updateVehicleTypeMutation = gql`
  mutation Update_vehicle_type($updateVehicleTypeId: ID!, $name: String) {
    update_vehicle_type(id: $updateVehicleTypeId, name: $name) {
      success
      message
    }
  }
`;
