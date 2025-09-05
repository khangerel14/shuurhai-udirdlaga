import type { UseTableReturn } from 'src/components/table';
import type { IVehicleManufactureTableFilters } from 'src/types/vehicle-manufacture';

import { useQuery, useMutation } from '@apollo/client';

import { getVehicleManufactureQuery } from 'src/graphql/queries';
import {
  createVehicleManufactureMutation,
  updateVehicleManufactureMutation,
  changeStatusVehicleManufactureMutation,
} from 'src/graphql/mutations/vehicle.manufacture.mutation';

import { handleRequest } from 'src/components/request/handle-request';

export function useGetManufacturesQuery({
  table,
  currentFilters,
  open,
}: {
  table?: UseTableReturn;
  currentFilters?: IVehicleManufactureTableFilters;
  open?: boolean;
}) {
  const { data, loading, refetch } = useQuery(getVehicleManufactureQuery, {
    variables: {
      ...currentFilters,
      page: (table?.page ?? 0) + 1,
      limit: table?.rowsPerPage ?? 10,
      order: table?.orderBy,
      sort: table?.order,
    },
    skip: !open,
  });

  const { get_vehicle_manufactures } = data ?? {};
  const { datas, count } = get_vehicle_manufactures ?? {};

  return { datas, loading, count, refetch };
}

export const useChangeStatusVehicleManufacture = ({ refetch }: { refetch: () => void }) => {
  const [changeStatusVehicleManufacture, { loading }] = useMutation(
    changeStatusVehicleManufactureMutation
  );

  const executeChangeStatusVehicleManufacture = async ({
    rowId,
    status,
  }: {
    rowId: string;
    status: string;
  }) => {
    try {
      const { data } = await changeStatusVehicleManufacture({
        variables: {
          changeStatusVehicleManufactureId: rowId,
          status,
        },
      });

      const { change_status_vehicle_manufacture } = data ?? {};
      const { success, message } = change_status_vehicle_manufacture ?? {};

      if (success) {
        refetch();
      }

      return handleRequest(message, success);
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeChangeStatusVehicleManufacture, loading };
};

export const useCreateUpdateVehicleManufacture = ({
  currentRow,
  dialogType,
}: {
  currentRow?: any;
  dialogType: string;
}) => {
  const [createUpdateVehicleManufacture, { loading }] = useMutation(
    currentRow ? updateVehicleManufactureMutation : createVehicleManufactureMutation
  );

  const executeCreateUpdateVehicleManufacture = async ({ name }: { name: string }) => {
    try {
      const { data } = await createUpdateVehicleManufacture({
        variables: {
          ...(currentRow ? { updateVehicleManufactureId: currentRow.id } : {}),
          name,
        },
      });

      const vehicleTypeData = data?.[`${dialogType}_vehicle_manufacture`] ?? {};
      const { success, message } = vehicleTypeData;

      return { message, success };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeCreateUpdateVehicleManufacture, loading };
};
