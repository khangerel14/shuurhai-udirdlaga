import { gql } from '@apollo/client';

import { vehicle } from '../models/vehicle';
import { subUserModel } from '../models/user';
import { traccarDeviceModel } from '../models/traccar';

export const getDriverQuery = gql`
  query Get_driver($getDriverId: ID!) {
    get_driver(id: $getDriverId) {
      success
      message
      data {
        id
        user {
          ${subUserModel}
        }
        tripCount
        latitude
        longitude
        deviceId
        vehicle {
          ${vehicle}
        }
        lastUpdate
        lastOnlineDate
        isOnline
        type
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
    }
  }
`;

export const getDriversQuery = gql`
  query Get_drivers(
    $getDriversId: String
    $firstName: String
    $deviceId: String
    $userId: String
    $isOnline: Boolean
    $type: DRIVER_TYPE_FILTER
    $status: STATUS_FILTER
    $page: Int
    $limit: Int
    $order: String
    $sort: String
  ) {
    get_drivers(
      id: $getDriversId
      firstName: $firstName
      deviceId: $deviceId
      user_id: $userId
      isOnline: $isOnline
      type: $type
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
        user {
          ${subUserModel}
        }
        tripCount
        latitude
        longitude
        deviceId
        vehicle {
          ${vehicle}
        }
        lastUpdate
        lastOnlineDate
        isOnline
        type
        traccar_device_id
        traccarDevice {
          ${traccarDeviceModel}
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
