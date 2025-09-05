import { gql } from '@apollo/client';

import { cityModel } from '../models/city';
import { subUserModel } from '../models/user';

export const getCalls = gql`
  query Get_calls(
    $getCallsId: String
    $type: DRIVER_TYPE_FILTER
    $cityId: String
    $districtId: String
    $subDistrictId: String
    $address: String
    $callerFirstName: String
    $callerPhoneNumber: String
    $patientFirstName: String
    $patientPhoneNumber: String
    $patientRegisterNumber: String
    $status: STATUS_FILTER
    $page: Int
    $limit: Int
    $order: String
    $sort: String
  ) {
    get_calls(
      id: $getCallsId
      type: $type
      city_id: $cityId
      district_id: $districtId
      sub_district_id: $subDistrictId
      address: $address
      callerFirstName: $callerFirstName
      callerPhoneNumber: $callerPhoneNumber
      patientFirstName: $patientFirstName
      patientPhoneNumber: $patientPhoneNumber
      patientRegisterNumber: $patientRegisterNumber
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
        type
        reason
        city {
          ${cityModel}
        }
        district {
          id
          name
          status
          createdAt
          updatedAt
        }
        subDistrict {
          id
          name
          status
          createdAt
          updatedAt
        }
        street
        no
        address
        latitude
        longitude
        callerFirstName
        callerLastName
        callerRegisterNumber
        callerPhoneNumber
        calledDate
        patientFirstName
        patientLastName
        patientRegisterNumber
        patientPhoneNumber
        patientAge
        patientGender
        level
        status
        callReasonFirst {
          id
          name
          type
          parentReason {
            id
            name
            type
            status
            createdAt
            updatedAt
          }
          status
          createdAt
          updatedAt
        }
        callReasonSecond {
          id
          name
          type
          status
          createdAt
          updatedAt
        }
        callReasonThird {
          id
          name
          type
          status
          createdAt
          updatedAt
        }
        isTransport
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
