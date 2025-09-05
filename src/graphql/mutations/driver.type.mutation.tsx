import { gql } from '@apollo/client';

export const createDriveTypeMutation = gql`
  mutation Create_driver_type($name: String!, $description: String!, $icon: String) {
    create_driver_type(name: $name, description: $description, icon: $icon) {
      success
      message
    }
  }
`;

export const updateDriveTypeMutation = gql`
  mutation Update_driver_type(
    $updateDriverTypeId: ID!
    $name: String
    $description: String
    $icon: String
  ) {
    update_driver_type(
      id: $updateDriverTypeId
      name: $name
      description: $description
      icon: $icon
    ) {
      success
      message
    }
  }
`;

export const changeStatusDriverTypeMutation = gql`
  mutation Change_status_driver_type($changeStatusDriverTypeId: ID!, $status: STATUS_ENUM!) {
    change_status_driver_type(id: $changeStatusDriverTypeId, status: $status) {
      success
      message
    }
  }
`;

export const updateDriverMutation = gql`
  mutation Update_driver($updateDriverId: ID!, $type: String) {
    update_driver(id: $updateDriverId, type: $type) {
      success
      message
    }
  }
`;
