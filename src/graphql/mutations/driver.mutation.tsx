import { gql } from '@apollo/client';

export const createDriverMutation = gql`
  mutation Create_driver(
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $password: String!
    $deviceId: String!
    $driverData: DriverDataInput!
    $avatar: String
  ) {
    create_driver(
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      password: $password
      deviceId: $deviceId
      driverData: $driverData
      avatar: $avatar
    ) {
      success
      message
    }
  }
`;

export const updateUserMutation = gql`
  mutation Update_user(
    $updateUserId: ID!
    $phoneNumber: String
    $avatar: String
    $firstName: String
    $lastName: String
    $gender: GENDER_ENUM
  ) {
    update_user(
      id: $updateUserId
      phoneNumber: $phoneNumber
      avatar: $avatar
      firstName: $firstName
      lastName: $lastName
      gender: $gender
    ) {
      success
      message
    }
  }
`;

export const updateDriverMutation = gql`
  mutation Update_driver($updateDriverId: ID!, $type: DRIVER_TYPE_ENUM, $deviceId: String) {
    update_driver(id: $updateDriverId, type: $type, deviceId: $deviceId) {
      success
      message
    }
  }
`;

export const updateDriverTypeMutation = gql`
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

export const changeStatusDriver = gql`
  mutation Change_status_driver($changeStatusDriverId: ID!, $status: STATUS_ENUM!) {
    change_status_driver(id: $changeStatusDriverId, status: $status) {
      success
      message
    }
  }
`;
