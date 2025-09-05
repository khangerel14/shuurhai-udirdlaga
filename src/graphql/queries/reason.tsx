import { gql } from '@apollo/client';

import { subUserModel } from '../models/user';

export const getCallReasons = gql`
  query Get_call_reasons(
    $getCallReasonsId: String
    $name: String
    $type: DRIVER_TYPE_FILTER
    $parentId: String
    $status: STATUS_FILTER
    $page: Int
    $limit: Int
    $order: String
    $sort: String
  ) {
    get_call_reasons(
      id: $getCallReasonsId
      name: $name
      type: $type
      parent_id: $parentId
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
