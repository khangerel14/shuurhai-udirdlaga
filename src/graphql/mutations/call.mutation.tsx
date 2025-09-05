import { gql } from '@apollo/client';

export const createCallPolice = gql`
  mutation Create_call_police(
    $callerPhoneNumber: String!
    $address: String!
    $type: DRIVER_TYPE_ENUM!
    $callerFirstName: String
    $callerLastName: String
    $callerRegisterNumber: String
    $patientFirstName: String
    $patientLastName: String
    $patientRegisterNumber: String
    $cityId: String
    $districtId: String
    $subDistrictId: String
    $street: String
    $no: String
    $latitude: Float
    $longitude: Float
    $reason: String
  ) {
    create_call_police(
      callerPhoneNumber: $callerPhoneNumber
      address: $address
      type: $type
      callerFirstName: $callerFirstName
      callerLastName: $callerLastName
      callerRegisterNumber: $callerRegisterNumber
      patientFirstName: $patientFirstName
      patientLastName: $patientLastName
      patientRegisterNumber: $patientRegisterNumber
      city_id: $cityId
      district_id: $districtId
      sub_district_id: $subDistrictId
      street: $street
      no: $no
      latitude: $latitude
      longitude: $longitude
      reason: $reason
    ) {
      success
      message
    }
  }
`;

export const createCallEmergency = gql`
  mutation Create_call_emergency(
    $address: String!
    $type: DRIVER_TYPE_ENUM!
    $callerFirstName: String!
    $callerLastName: String!
    $callerRegisterNumber: String!
    $callerPhoneNumber: String!
    $callReasonFirstId: String!
    $cityId: String
    $districtId: String
    $subDistrictId: String
    $street: String
    $no: String
    $latitude: Float
    $longitude: Float
    $reason: String
    $calledDate: String
    $callReasonSecondId: String
    $callReasonThirdId: String
  ) {
    create_call_emergency(
      address: $address
      type: $type
      callerFirstName: $callerFirstName
      callerLastName: $callerLastName
      callerRegisterNumber: $callerRegisterNumber
      callerPhoneNumber: $callerPhoneNumber
      call_reason_first_id: $callReasonFirstId
      city_id: $cityId
      district_id: $districtId
      sub_district_id: $subDistrictId
      street: $street
      no: $no
      latitude: $latitude
      longitude: $longitude
      reason: $reason
      calledDate: $calledDate
      call_reason_second_id: $callReasonSecondId
      call_reason_third_id: $callReasonThirdId
    ) {
      success
      message
    }
  }
`;

export const createCallAmbulance = gql`
  mutation Create_call_ambulance(
    $address: String!
    $type: DRIVER_TYPE_ENUM!
    $callerPhoneNumber: String!
    $patientFirstName: String
    $patientLastName: String
    $patientRegisterNumber: String
    $patientPhoneNumber: String
    $patientAge: Int
    $patientGender: GENDER_ENUM
    $reason: String
    $level: LEVEL_ENUM
    $cityId: String
    $districtId: String
    $subDistrictId: String
    $street: String
    $no: String
    $latitude: Float
    $longitude: Float
  ) {
    create_call_ambulance(
      address: $address
      type: $type
      callerPhoneNumber: $callerPhoneNumber
      patientFirstName: $patientFirstName
      patientLastName: $patientLastName
      patientRegisterNumber: $patientRegisterNumber
      patientPhoneNumber: $patientPhoneNumber
      patientAge: $patientAge
      patientGender: $patientGender
      reason: $reason
      level: $level
      city_id: $cityId
      district_id: $districtId
      sub_district_id: $subDistrictId
      street: $street
      no: $no
      latitude: $latitude
      longitude: $longitude
    ) {
      success
      message
    }
  }
`;
