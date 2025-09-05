import { gql } from '@apollo/client';

export const getImapTile = gql`
  query Get_imap_tile($androidDeepLink: String, $iosDeepLink: String) {
    get_imap_tile(androidDeepLink: $androidDeepLink, iosDeepLink: $iosDeepLink) {
      message
      success
      url
    }
  }
`;

export const getImapPointAddress = gql`
  query Get_imap_point_address($latitude: Float!, $longitude: Float!) {
    get_imap_point_address(latitude: $latitude, longitude: $longitude) {
      message
      success
      address
    }
  }
`;
