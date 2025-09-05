import { gql } from '@apollo/client';

import { cityModel } from '../models/city';
import { subUserModel } from '../models/user';

export const getCommitteesQuery = gql`
query Get_sub_districts($getSubDistrictsId: String, $name: String, $districtId: String, $status: STATUS_FILTER, $page: Int, $limit: Int, $order: String, $sort: String) {
  get_sub_districts(id: $getSubDistrictsId, name: $name, district_id: $districtId, status: $status, page: $page, limit: $limit, order: $order, sort: $sort) {
    success
    message
    datas {
        id
        name
        district {
          id
          name
          city {
            ${cityModel}
          }
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
