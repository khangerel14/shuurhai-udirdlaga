import { useQuery } from '@apollo/client';

import { getImapTile } from 'src/graphql/queries';
import { getImapPointAddress } from 'src/graphql/queries/imap-tile';

export const useGetImapTile = () => {
  const { data, loading } = useQuery(getImapTile);

  const { get_imap_tile } = data ?? {};
  const { message, success, url } = get_imap_tile ?? {};

  return { message, success, url, loading };
};

export const useGetImapPointAddress = ({
  longitude,
  latitude,
}: {
  longitude: number;
  latitude: number;
}) => {
  const { data, loading } = useQuery(getImapPointAddress, {
    variables: { longitude, latitude },
  });

  const { get_imap_point_address } = data ?? {};
  const { message, success, address } = get_imap_point_address ?? {};

  return { message, success, address, loading };
};
