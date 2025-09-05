import { gql } from '@apollo/client';

export const createVehicleMutation = gql`
  mutation Create_vehicle(
    $vehicleModelId: String!
    $userId: String!
    $licencePlate: String!
    $certificate: String
    $color: String
    $importDate: Date
  ) {
    create_vehicle(
      vehicle_model_id: $vehicleModelId
      user_id: $userId
      licencePlate: $licencePlate
      certificate: $certificate
      color: $color
      importDate: $importDate
    ) {
      success
      message
    }
  }
`;

export const updateVehicleMutation = gql`
  mutation Update_vehicle(
    $updateVehicleId: ID!
    $vehicleModelId: String
    $licencePlate: String
    $certificate: String
    $color: String
    $importDate: Date
  ) {
    update_vehicle(
      id: $updateVehicleId
      vehicle_model_id: $vehicleModelId
      licencePlate: $licencePlate
      certificate: $certificate
      color: $color
      importDate: $importDate
    ) {
      success
      message
    }
  }
`;
