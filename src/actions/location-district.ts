import type { UseTableReturn } from 'src/components/table';
import type { IDistrictType, IDistrictTypeTableFilters } from 'src/types/location-district';

import { useQuery, useMutation } from '@apollo/client';

import { getDistrictsQuery } from 'src/graphql/queries/location.district.query';
import {
  updateDistrictMutation,
  createDisctrictMutation,
  changeStatusDistrictMutation,
} from 'src/graphql/mutations/location.district.mutation';

import { handleRequest } from 'src/components/request/handle-request';

export function useGetDistrictsQuery({
  open,
  table,
  cityId,
  currentFilters,
}: {
  open?: boolean;
  table?: UseTableReturn;
  cityId?: string | null;
  currentFilters?: IDistrictTypeTableFilters;
}) {
  const { data, loading, refetch } = useQuery(getDistrictsQuery, {
    variables: {
      ...currentFilters,
      cityId: currentFilters?.city_id ?? cityId,
      page: table?.page,
      limit: table?.rowsPerPage,
      order: table?.orderBy,
      sort: table?.order,
    },
    skip: !open,
  });

  const { get_districts } = data ?? {};
  const { datas, count } = get_districts ?? {};

  return { datas, count, loading, refetch };
}

export const useCreateOrUpdateDistrictMutation = ({
  currentRow,
}: {
  currentRow?: IDistrictType | null;
}) => {
  const [data, { loading }] = useMutation(
    currentRow ? updateDistrictMutation : createDisctrictMutation
  );

  const executeDistrictMutation = async (variables: { name: string; cityId: string }) => {
    const { data: response } = await data({
      variables: {
        ...variables,
        ...(currentRow && { updateDistrictId: currentRow?.id }),
      },
    });

    const { create_district, update_district } = response ?? {};
    const { success, message } = create_district ?? update_district ?? {};

    return { success, message };
  };

  return { executeDistrictMutation, loading };
};

export const useChangeStatusDistrictMutation = ({ refetch }: { refetch: () => void }) => {
  const [changeStatusDistrict, { loading }] = useMutation(changeStatusDistrictMutation, {
    onCompleted: () => {
      refetch();
    },
  });

  const executeChangeStatusDistrict = async ({
    rowId,
    status,
  }: {
    rowId: string;
    status: string;
  }): Promise<{ message: string; success: boolean }> => {
    const { data: response } = await changeStatusDistrict({
      variables: {
        changeStatusDistrictId: rowId,
        status,
      },
    });

    const { change_status_district } = response ?? {};
    const { message, success } = change_status_district ?? {};

    handleRequest(message, success);
    return { message, success };
  };

  return { executeChangeStatusDistrict, loading };
};
