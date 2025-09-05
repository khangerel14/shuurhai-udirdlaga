import { gql } from '@apollo/client';

export const createDisctrictMutation = gql`
  mutation Create_district($name: String!, $cityId: String!) {
    create_district(name: $name, city_id: $cityId) {
      success
      message
    }
  }
`;

export const updateDistrictMutation = gql`
  mutation Update_district($updateDistrictId: ID!, $name: String, $cityId: String) {
    update_district(id: $updateDistrictId, name: $name, city_id: $cityId) {
      success
      message
    }
  }
`;

export const changeStatusDistrictMutation = gql`
  mutation Change_status_district($changeStatusDistrictId: ID!, $status: STATUS_ENUM!) {
    change_status_district(id: $changeStatusDistrictId, status: $status) {
      success
      message
    }
  }
`;
