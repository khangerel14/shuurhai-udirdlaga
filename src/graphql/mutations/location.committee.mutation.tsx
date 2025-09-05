import { gql } from '@apollo/client';

export const createCommitteeMutation = gql`
  mutation Create_sub_district($name: String!, $districtId: String!) {
    create_sub_district(name: $name, district_id: $districtId) {
      success
      message
    }
  }
`;
export const updateCommitteeMutation = gql`
  mutation Update_sub_district($updateSubDistrictId: ID!, $name: String, $districtId: String) {
    update_sub_district(id: $updateSubDistrictId, name: $name, district_id: $districtId) {
      success
      message
    }
  }
`;

export const changeStatusCommitteeMutation = gql`
  mutation Change_status_sub_district($changeStatusSubDistrictId: ID!, $status: STATUS_ENUM!) {
    change_status_sub_district(id: $changeStatusSubDistrictId, status: $status) {
      success
      message
    }
  }
`;
