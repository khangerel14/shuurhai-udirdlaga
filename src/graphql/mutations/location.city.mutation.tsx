import { gql } from '@apollo/client';

export const createCityMutation = gql`
  mutation Create_city($name: String!) {
    create_city(name: $name) {
      success
      message
    }
  }
`;

export const updateCityMutation = gql`
  mutation Update_city($updateCityId: ID!, $name: String) {
    update_city(id: $updateCityId, name: $name) {
      success
      message
    }
  }
`;

export const changeCityStatusMutation = gql`
  mutation Change_status_city($changeStatusCityId: ID!, $status: STATUS_ENUM!) {
    change_status_city(id: $changeStatusCityId, status: $status) {
      success
      message
    }
  }
`;
