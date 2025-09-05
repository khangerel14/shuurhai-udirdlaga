import type { UseTableReturn } from 'src/components/table';
import type { IVehicleTypeTableFilters } from 'src/types/vehicle-type';

import { useQuery, useMutation } from '@apollo/client';

import { getVehicleTypesQuery } from 'src/graphql/queries';
import {
  createVehicleTypeMutation,
  updateVehicleTypeMutation,
  changeStatusVehicleTypeMutation,
} from 'src/graphql/mutations/vehicle.type.mutation';

import { handleRequest } from 'src/components/request/handle-request';

export function useGetVehicleTypesQuery({
  open,
  table,
  currentFilters,
}: {
  open?: boolean;
  table?: UseTableReturn;
  currentFilters?: IVehicleTypeTableFilters;
}) {
  const { data, loading, refetch } = useQuery(getVehicleTypesQuery, {
    variables: {
      ...currentFilters,
      page: (table?.page ?? 0) + 1,
      limit: table?.rowsPerPage ?? 10,
      order: table?.orderBy,
      sort: table?.order,
    },
    skip: !open,
  });

  const { get_vehicle_types } = data ?? {};
  const { datas, count } = get_vehicle_types ?? {};

  return { datas, loading, count, refetch };
}

export const useChangeStatusVehicleType = ({ refetch }: { refetch: () => void }) => {
  const [changeStatusVehicleType, { loading }] = useMutation(changeStatusVehicleTypeMutation);

  const executeChangeStatusVehicleType = async ({
    rowId,
    status,
  }: {
    rowId: string;
    status: string;
  }) => {
    try {
      const { data } = await changeStatusVehicleType({
        variables: {
          changeStatusVehicleTypeId: rowId,
          status,
        },
      });

      const { change_status_vehicle_type } = data ?? {};
      const { success, message } = change_status_vehicle_type ?? {};

      if (success) {
        refetch();
      }

      return handleRequest(message, success);
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeChangeStatusVehicleType, loading };
};

export const useCreateUpdateVehicleType = ({
  currentRow,
  dialogType,
}: {
  currentRow?: any;
  dialogType: string;
}) => {
  const [createUpdateVehicleType, { loading }] = useMutation(
    currentRow ? updateVehicleTypeMutation : createVehicleTypeMutation
  );

  const executeCreateUpdateVehicleType = async ({ name }: { name: string }) => {
    try {
      const { data } = await createUpdateVehicleType({
        variables: {
          ...(currentRow ? { updateVehicleTypeId: currentRow.id } : {}),
          name,
        },
      });

      const vehicleTypeData = data?.[`${dialogType}_vehicle_type`] ?? {};
      const { success, message } = vehicleTypeData;

      return { message, success };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeCreateUpdateVehicleType, loading };
};
