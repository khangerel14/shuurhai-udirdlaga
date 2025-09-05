import type { UseTableReturn } from 'src/components/table';
import type { ICityType, ICityTypeTableFilters } from 'src/types/location-city';

import { useQuery, useMutation } from '@apollo/client';

import { getCitiesQuery } from 'src/graphql/queries/location.city.query';
import {
  createCityMutation,
  updateCityMutation,
  changeCityStatusMutation,
} from 'src/graphql/mutations/location.city.mutation';

import { handleRequest } from 'src/components/request/handle-request';

export const useGetCitiesQuery = ({
  open,
  table,
  currentFilters,
}: {
  open?: boolean;
  table?: UseTableReturn;
  currentFilters?: ICityTypeTableFilters;
}) => {
  const { data, loading, refetch } = useQuery(getCitiesQuery, {
    variables: {
      ...currentFilters,
      page: (table?.page ?? 0) + 1,
      limit: table?.rowsPerPage,
      order: table?.orderBy,
      sort: table?.order,
    },
    skip: !open,
  });

  const { get_cities } = data ?? {};
  const { datas, count } = get_cities ?? [];

  return { datas, loading, count, refetch };
};

export const useCreateOrUpdateCityMutation = ({
  currentRow,
}: {
  currentRow?: ICityType | null;
}) => {
  const [data, { loading }] = useMutation(currentRow ? updateCityMutation : createCityMutation);

  const executeCityMutation = async (variables: { name: string }) => {
    const { data: response } = await data({
      variables: {
        ...variables,
        ...(currentRow && { updateCityId: currentRow?.id }),
      },
    });

    const { create_city, update_city } = response ?? {};
    const { success, message } = create_city ?? update_city ?? {};

    return { success, message };
  };

  return { executeCityMutation, loading };
};

export const useChangeStatusCityMutation = ({ refetch }: { refetch: () => void }) => {
  const [changeStatusCity, { loading }] = useMutation(changeCityStatusMutation, {
    onCompleted: () => {
      refetch();
    },
  });

  const executeChangeStatusCity = async ({
    rowId,
    status,
  }: {
    rowId: string;
    status: string;
  }): Promise<{ message: string; success: boolean }> => {
    const { data: response } = await changeStatusCity({
      variables: {
        changeStatusCityId: rowId,
        status,
      },
    });

    const { change_status_city } = response ?? {};
    const { message, success } = change_status_city ?? {};

    handleRequest(message, success);
    return { message, success };
  };

  return { executeChangeStatusCity, loading };
};
